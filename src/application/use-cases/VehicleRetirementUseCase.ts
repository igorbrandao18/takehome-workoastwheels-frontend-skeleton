import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { ValidationError } from '../../domain/errors/ValidationError';
import { DomainEventPublisher } from '../../domain/events/DomainEventPublisher';
import { VehicleRetirementEvent } from '../../domain/events/VehicleRetirementEvent';

interface RetirementReason {
    category: 'AGE' | 'MILEAGE' | 'MAINTENANCE_COST' | 'ACCIDENT' | 'OTHER';
    description: string;
    details?: Record<string, any>;
}

interface RetirementReport {
    vehicleId: string;
    retirementDate: Date;
    reason: RetirementReason;
    finalMileage: number;
    totalMaintenanceCost: number;
    salvageValue: number;
    notes?: string;
}

export class VehicleRetirementUseCase {
    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly reservationRepository: IReservationRepository,
        private readonly vehicleDomainService: VehicleDomainService
    ) {}

    async retireVehicle(report: RetirementReport): Promise<void> {
        const vehicle = await this.vehicleRepository.findById(report.vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        // Verificar se há reservas futuras
        const futureReservations = await this.reservationRepository.findFutureReservations(report.vehicleId);
        if (futureReservations.length > 0) {
            throw new ValidationError('Vehicle has future reservations and cannot be retired');
        }

        // Validar se o veículo pode ser aposentado
        if (!this.vehicleDomainService.canBeRetired(vehicle)) {
            throw new ValidationError('Vehicle does not meet retirement criteria');
        }

        // Calcular métricas finais
        const maintenanceHistory = await this.vehicleRepository.getMaintenanceRecords(report.vehicleId);
        const totalMaintenanceCost = maintenanceHistory.reduce(
            (sum, record) => sum + (record.cost || 0),
            0
        );

        const finalReport = {
            ...report,
            totalMaintenanceCost,
            retirementMetrics: {
                totalLifetimeMileage: report.finalMileage,
                averageMaintenanceCostPerYear: totalMaintenanceCost / vehicle.getAgeInYears(),
                totalReservations: await this.reservationRepository.countByVehicle(report.vehicleId)
            }
        };

        // Atualizar status do veículo
        vehicle.changeStatus('RETIRED');
        await this.vehicleRepository.update(vehicle);

        // Registrar aposentadoria
        await this.vehicleRepository.addRetirementRecord(report.vehicleId, finalReport);

        // Publicar evento
        DomainEventPublisher.publish(new VehicleRetirementEvent({
            vehicleId: vehicle.id,
            retirementDate: report.retirementDate,
            reason: report.reason,
            metrics: finalReport.retirementMetrics
        }));
    }

    async getRetirementCandidates(): Promise<{
        vehicleId: string;
        criteria: string[];
        recommendedAction: 'RETIRE' | 'EVALUATE';
        metrics: {
            age: number;
            mileage: number;
            maintenanceCost: number;
            utilization: number;
        };
    }[]> {
        const vehicles = await this.vehicleRepository.findAll();
        const candidates = [];

        for (const vehicle of vehicles) {
            if (vehicle.status === 'RETIRED') continue;

            const criteria = [];
            const metrics = {
                age: vehicle.getAgeInYears(),
                mileage: await this.vehicleRepository.getVehicleMileage(vehicle.id),
                maintenanceCost: 0,
                utilization: 0
            };

            // Verificar critérios de idade
            if (metrics.age > 10) {
                criteria.push('AGE_LIMIT_EXCEEDED');
            }

            // Verificar quilometragem
            if (metrics.mileage > 150000) {
                criteria.push('MILEAGE_LIMIT_EXCEEDED');
            }

            // Calcular custos de manutenção
            const maintenanceRecords = await this.vehicleRepository.getMaintenanceRecords(vehicle.id);
            metrics.maintenanceCost = maintenanceRecords.reduce(
                (sum, record) => sum + (record.cost || 0),
                0
            );

            if (metrics.maintenanceCost > 50000) {
                criteria.push('HIGH_MAINTENANCE_COST');
            }

            // Calcular taxa de utilização
            const reservations = await this.reservationRepository.findByVehicle(vehicle.id);
            metrics.utilization = this.calculateUtilizationRate(reservations);

            if (metrics.utilization < 0.3) {
                criteria.push('LOW_UTILIZATION');
            }

            if (criteria.length > 0) {
                candidates.push({
                    vehicleId: vehicle.id,
                    criteria,
                    recommendedAction: criteria.length >= 2 ? 'RETIRE' : 'EVALUATE',
                    metrics
                });
            }
        }

        return candidates;
    }

    private calculateUtilizationRate(reservations: any[]): number {
        // Implementar cálculo de taxa de utilização
        // Baseado no histórico de reservas dos últimos 12 meses
        return 0;
    }
} 
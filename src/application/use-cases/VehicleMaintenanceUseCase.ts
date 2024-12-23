import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { ValidationError } from '../../domain/errors/ValidationError';
import { DomainEventPublisher } from '../../domain/events/DomainEventPublisher';
import { VehicleMaintenanceEvent } from '../../domain/events/VehicleMaintenanceEvent';

interface MaintenanceSchedule {
    startDate: Date;
    endDate: Date;
    type: 'PREVENTIVE' | 'CORRECTIVE';
    description: string;
}

interface MaintenanceRecord {
    vehicleId: string;
    schedule: MaintenanceSchedule;
    cost?: number;
    notes?: string;
}

export class VehicleMaintenanceUseCase {
    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly reservationRepository: IReservationRepository,
        private readonly vehicleDomainService: VehicleDomainService
    ) {}

    async scheduleVehicleMaintenance(input: MaintenanceRecord): Promise<void> {
        const vehicle = await this.vehicleRepository.findById(input.vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        // Verificar se há reservas no período
        const conflictingReservations = await this.reservationRepository.findOverlapping(
            input.vehicleId,
            {
                startTime: input.schedule.startDate,
                endTime: input.schedule.endDate
            }
        );

        if (conflictingReservations.length > 0) {
            throw new ValidationError('Vehicle has reservations during maintenance period');
        }

        // Validar a mudança de status
        this.vehicleDomainService.validateStatusChange(vehicle, 'MAINTENANCE');

        // Atualizar status do veículo
        vehicle.changeStatus('MAINTENANCE');
        await this.vehicleRepository.update(vehicle);

        // Publicar evento de manutenção
        DomainEventPublisher.publish(new VehicleMaintenanceEvent({
            vehicleId: vehicle.id,
            maintenanceType: input.schedule.type,
            startDate: input.schedule.startDate,
            endDate: input.schedule.endDate
        }));
    }

    async completeVehicleMaintenance(
        vehicleId: string,
        completionNotes: {
            cost: number;
            notes: string;
            serviceDone: string[];
        }
    ): Promise<void> {
        const vehicle = await this.vehicleRepository.findById(vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        if (vehicle.status !== 'MAINTENANCE') {
            throw new ValidationError('Vehicle is not in maintenance');
        }

        // Validar a mudança de status
        this.vehicleDomainService.validateStatusChange(vehicle, 'AVAILABLE');

        // Atualizar status do veículo
        vehicle.changeStatus('AVAILABLE');
        await this.vehicleRepository.update(vehicle);

        // Registrar conclusão da manutenção
        await this.vehicleRepository.addMaintenanceRecord(vehicleId, {
            completedAt: new Date(),
            ...completionNotes
        });

        // Publicar evento de conclusão da manutenção
        DomainEventPublisher.publish(new VehicleMaintenanceEvent({
            vehicleId: vehicle.id,
            maintenanceType: 'COMPLETED',
            completionDetails: completionNotes
        }));
    }

    async getMaintenanceHistory(vehicleId: string): Promise<MaintenanceRecord[]> {
        const vehicle = await this.vehicleRepository.findById(vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        return this.vehicleRepository.getMaintenanceRecords(vehicleId);
    }

    async getVehiclesRequiringMaintenance(): Promise<string[]> {
        const vehicles = await this.vehicleRepository.findAll();
        const requireMaintenance = vehicles.filter(vehicle => 
            this.vehicleDomainService.requiresMaintenance(vehicle)
        );

        return requireMaintenance.map(v => v.id);
    }
} 
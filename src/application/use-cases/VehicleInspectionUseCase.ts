import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { ValidationError } from '../../domain/errors/ValidationError';
import { DomainEventPublisher } from '../../domain/events/DomainEventPublisher';
import { VehicleInspectionEvent } from '../../domain/events/VehicleInspectionEvent';

interface InspectionItem {
    category: string;
    item: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    notes?: string;
}

interface InspectionReport {
    vehicleId: string;
    inspectedAt: Date;
    inspector: string;
    mileage: number;
    items: InspectionItem[];
    overallStatus: 'APPROVED' | 'REJECTED' | 'NEEDS_ATTENTION';
    recommendations?: string[];
}

export class VehicleInspectionUseCase {
    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly vehicleDomainService: VehicleDomainService
    ) {}

    async performInspection(report: InspectionReport): Promise<void> {
        const vehicle = await this.vehicleRepository.findById(report.vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        // Validar se o veículo pode ser inspecionado
        if (vehicle.status === 'MAINTENANCE') {
            throw new ValidationError('Vehicle is under maintenance');
        }

        // Calcular status geral baseado nos itens
        const failedItems = report.items.filter(item => item.status === 'FAIL');
        const warningItems = report.items.filter(item => item.status === 'WARNING');

        let overallStatus: 'APPROVED' | 'REJECTED' | 'NEEDS_ATTENTION';
        if (failedItems.length > 0) {
            overallStatus = 'REJECTED';
        } else if (warningItems.length > 0) {
            overallStatus = 'NEEDS_ATTENTION';
        } else {
            overallStatus = 'APPROVED';
        }

        // Atualizar o relatório com o status calculado
        const finalReport = {
            ...report,
            overallStatus
        };

        // Registrar a inspeção
        await this.vehicleRepository.addInspectionRecord(report.vehicleId, finalReport);

        // Se reprovado, colocar em manutenção
        if (overallStatus === 'REJECTED') {
            this.vehicleDomainService.validateStatusChange(vehicle, 'MAINTENANCE');
            vehicle.changeStatus('MAINTENANCE');
            await this.vehicleRepository.update(vehicle);
        }

        // Publicar evento de inspeção
        DomainEventPublisher.publish(new VehicleInspectionEvent({
            vehicleId: vehicle.id,
            inspectionDate: report.inspectedAt,
            status: overallStatus,
            failedItems: failedItems.map(item => item.item),
            warningItems: warningItems.map(item => item.item)
        }));
    }

    async getInspectionHistory(vehicleId: string): Promise<InspectionReport[]> {
        const vehicle = await this.vehicleRepository.findById(vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        return this.vehicleRepository.getInspectionRecords(vehicleId);
    }

    async getVehiclesRequiringInspection(): Promise<string[]> {
        const vehicles = await this.vehicleRepository.findAll();
        const requireInspection = vehicles.filter(vehicle => 
            this.vehicleDomainService.requiresInspection(vehicle)
        );

        return requireInspection.map(v => v.id);
    }

    async getInspectionSummary(vehicleId: string): Promise<{
        lastInspectionDate: Date | null;
        totalInspections: number;
        failureRate: number;
        commonIssues: string[];
    }> {
        const inspections = await this.getInspectionHistory(vehicleId);
        if (inspections.length === 0) {
            return {
                lastInspectionDate: null,
                totalInspections: 0,
                failureRate: 0,
                commonIssues: []
            };
        }

        const failedInspections = inspections.filter(i => i.overallStatus === 'REJECTED');
        const issues = inspections
            .flatMap(i => i.items)
            .filter(item => item.status === 'FAIL')
            .map(item => item.item);

        // Contar ocorrências de cada problema
        const issueCount = issues.reduce((acc, issue) => {
            acc[issue] = (acc[issue] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Pegar os 5 problemas mais comuns
        const commonIssues = Object.entries(issueCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([issue]) => issue);

        return {
            lastInspectionDate: new Date(inspections[0].inspectedAt),
            totalInspections: inspections.length,
            failureRate: (failedInspections.length / inspections.length) * 100,
            commonIssues
        };
    }
} 
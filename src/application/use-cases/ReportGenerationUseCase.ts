import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { Money } from '../../domain/value-objects/Money';

interface ReportPeriod {
    startDate: Date;
    endDate: Date;
}

interface RevenueReport {
    totalRevenue: Money;
    revenueByVehicleClass: Record<string, Money>;
    averageRevenuePerDay: Money;
}

interface UtilizationReport {
    totalVehicles: number;
    activeVehicles: number;
    utilizationRate: number;
    utilizationByVehicleClass: Record<string, number>;
}

interface ReservationMetrics {
    totalReservations: number;
    completedReservations: number;
    canceledReservations: number;
    completionRate: number;
    averageDuration: number;
}

export class ReportGenerationUseCase {
    constructor(
        private readonly reservationRepository: IReservationRepository,
        private readonly vehicleRepository: IVehicleRepository
    ) {}

    async generateRevenueReport(period: ReportPeriod): Promise<RevenueReport> {
        const reservations = await this.reservationRepository.findByPeriod(
            period.startDate,
            period.endDate
        );

        const totalRevenue = reservations
            .filter(r => r.status === 'COMPLETED')
            .reduce((sum, r) => sum + r.totalAmount.amount, 0);

        const revenueByClass = reservations
            .filter(r => r.status === 'COMPLETED')
            .reduce((acc, r) => {
                const classification = r.vehicle.classification;
                acc[classification] = (acc[classification] || 0) + r.totalAmount.amount;
                return acc;
            }, {} as Record<string, number>);

        const days = Math.ceil(
            (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
            totalRevenue: new Money(totalRevenue, 'USD'),
            revenueByVehicleClass: Object.entries(revenueByClass).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: new Money(value, 'USD')
                }),
                {}
            ),
            averageRevenuePerDay: new Money(totalRevenue / days, 'USD')
        };
    }

    async generateUtilizationReport(period: ReportPeriod): Promise<UtilizationReport> {
        const vehicles = await this.vehicleRepository.findAll();
        const reservations = await this.reservationRepository.findByPeriod(
            period.startDate,
            period.endDate
        );

        const activeVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;

        const utilizationByClass = vehicles.reduce((acc, v) => {
            const vehicleReservations = reservations.filter(r => r.vehicleId === v.id);
            const totalHours = vehicleReservations.reduce(
                (sum, r) => sum + r.timeRange.getDurationInHours(),
                0
            );
            const possibleHours = 24 * Math.ceil(
                (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            acc[v.classification.value] = (totalHours / possibleHours) * 100;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalVehicles: vehicles.length,
            activeVehicles,
            utilizationRate: (activeVehicles / vehicles.length) * 100,
            utilizationByVehicleClass: utilizationByClass
        };
    }

    async generateReservationMetrics(period: ReportPeriod): Promise<ReservationMetrics> {
        const reservations = await this.reservationRepository.findByPeriod(
            period.startDate,
            period.endDate
        );

        const completed = reservations.filter(r => r.status === 'COMPLETED');
        const canceled = reservations.filter(r => r.status === 'CANCELED');

        const totalDuration = completed.reduce(
            (sum, r) => sum + r.timeRange.getDurationInHours(),
            0
        );

        return {
            totalReservations: reservations.length,
            completedReservations: completed.length,
            canceledReservations: canceled.length,
            completionRate: (completed.length / reservations.length) * 100,
            averageDuration: completed.length ? totalDuration / completed.length : 0
        };
    }
} 
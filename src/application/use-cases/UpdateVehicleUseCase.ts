import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { VehicleClassification } from '../../domain/value-objects/VehicleClassification';
import { ValidationError } from '../../domain/errors/ValidationError';
import { VehicleStatus } from '../../domain/entities/Vehicle';

interface UpdateVehicleInput {
    id: string;
    status?: VehicleStatus;
    classification?: string;
}

export class UpdateVehicleUseCase {
    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly reservationRepository: IReservationRepository,
        private readonly vehicleDomainService: VehicleDomainService
    ) {}

    async execute(input: UpdateVehicleInput) {
        const vehicle = await this.vehicleRepository.findById(input.id);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        if (input.status) {
            // Validar mudança de status
            this.vehicleDomainService.validateStatusChange(vehicle, input.status);

            // Se for colocar em manutenção, verificar reservas ativas
            if (input.status === 'MAINTENANCE') {
                const activeReservations = await this.reservationRepository.findActiveByVehicle(input.id);
                if (activeReservations.length > 0) {
                    throw new ValidationError('Cannot put vehicle in maintenance with active reservations');
                }
            }

            vehicle.changeStatus(input.status);
        }

        if (input.classification) {
            const classification = new VehicleClassification(input.classification);
            await this.vehicleDomainService.changeClassification(vehicle, classification);
        }

        // Salvar alterações
        await this.vehicleRepository.update(vehicle);

        return vehicle;
    }
} 
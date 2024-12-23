import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { Vehicle } from '../../domain/entities/Vehicle';
import { VehicleClassification } from '../../domain/value-objects/VehicleClassification';
import { ValidationError } from '../../domain/errors/ValidationError';

interface CreateVehicleInput {
    model: string;
    plate: string;
    year: number;
    classification: string;
}

export class CreateVehicleUseCase {
    constructor(
        private readonly vehicleRepository: IVehicleRepository,
        private readonly vehicleDomainService: VehicleDomainService
    ) {}

    async execute(input: CreateVehicleInput) {
        // Verificar se já existe veículo com a mesma placa
        const existingVehicle = await this.vehicleRepository.findByPlate(input.plate);
        if (existingVehicle) {
            throw new ValidationError('Vehicle with this plate already exists');
        }

        const vehicle = new Vehicle({
            model: input.model,
            plate: input.plate.toUpperCase(),
            year: input.year,
            status: 'AVAILABLE',
            classification: new VehicleClassification(input.classification)
        });

        // Validar regras de domínio
        this.vehicleDomainService.validateVehicleCreation(vehicle);

        // Salvar veículo
        await this.vehicleRepository.save(vehicle);

        return vehicle;
    }
} 
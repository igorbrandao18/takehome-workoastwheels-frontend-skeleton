import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { ValidationError } from '../../domain/errors/ValidationError';
import { UserStatus } from '../../domain/entities/User';

interface UpdateUserInput {
    id: string;
    email?: string;
    password?: string;
    name?: string;
    status?: UserStatus;
}

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly reservationRepository: IReservationRepository,
        private readonly userDomainService: UserDomainService
    ) {}

    async execute(input: UpdateUserInput) {
        const user = await this.userRepository.findById(input.id);
        if (!user) {
            throw new ValidationError('User not found');
        }

        if (input.email) {
            const email = new Email(input.email);
            const existingEmails = await this.userRepository.findAllEmails();
            this.userDomainService.validateEmailChange(user, email, existingEmails);
            user.updateEmail(email);
        }

        if (input.password) {
            const password = new Password(input.password);
            user.updatePassword(password);
        }

        if (input.name) {
            user.updateName(input.name);
        }

        if (input.status) {
            const activeReservations = await this.reservationRepository.findActiveByUser(input.id);
            this.userDomainService.validateStatusChange(user, input.status, activeReservations);
            
            if (input.status === 'SUSPENDED') {
                user.suspend();
            } else if (input.status === 'ACTIVE') {
                user.activate();
            }
        }

        await this.userRepository.update(user);

        return {
            id: user.id,
            email: user.email.value,
            name: user.name,
            role: user.role,
            status: user.status
        };
    }
} 
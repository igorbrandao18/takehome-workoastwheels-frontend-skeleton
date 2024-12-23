import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { ValidationError } from '../../domain/errors/ValidationError';

interface CreateUserInput {
    email: string;
    password: string;
    name: string;
    role?: string;
}

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userDomainService: UserDomainService
    ) {}

    async execute(input: CreateUserInput) {
        const email = new Email(input.email);
        const password = new Password(input.password);

        // Validar regras de domínio
        this.userDomainService.validateUserCreation(email, password, input.name);

        // Verificar se email já existe
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const user = new User({
            email,
            password,
            name: input.name,
            role: input.role || 'USER',
            status: 'ACTIVE',
            reservationLimit: 3
        });

        await this.userRepository.save(user);

        return {
            id: user.id,
            email: user.email.value,
            name: user.name,
            role: user.role,
            status: user.status
        };
    }
} 
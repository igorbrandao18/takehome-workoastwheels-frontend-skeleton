import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { INotificationService } from '../interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { ValidationError } from '../../domain/errors/ValidationError';
import { User } from '../../domain/entities/User';

interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export class UserApplicationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async registerUser(data: {
    name: string;
    email: Email;
    password: Password;
  }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email.value);
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const user = new User({
      name: data.name,
      email: data.email.value,
      password: data.password.value,
      role: 'USER',
      status: 'ACTIVE'
    });

    await this.userRepository.save(user);

    await this.notificationService.sendPushNotification(user.id, {
      title: 'Welcome!',
      body: 'Your account has been created successfully.'
    });

    return user;
  }

  async loginUser(email: Email, password: Password): Promise<User> {
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      throw new ValidationError('Invalid credentials');
    }

    const isValid = await Password.compare(password.value, user.password);
    if (!isValid) {
      throw new ValidationError('Invalid credentials');
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (data.name) {
      user.name = data.name;
    }

    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new ValidationError('Email already in use');
      }
      user.email = data.email;
    }

    await this.userRepository.update(user);

    return user;
  }

  async changePassword(
    id: string,
    currentPassword: Password,
    newPassword: Password
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const isValid = await Password.compare(currentPassword.value, user.password);
    if (!isValid) {
      throw new ValidationError('Invalid current password');
    }

    user.password = newPassword.value;
    await this.userRepository.update(user);

    await this.notificationService.sendPushNotification(user.id, {
      title: 'Password Changed',
      body: 'Your password has been changed successfully.'
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    await this.userRepository.delete(id);

    await this.notificationService.sendPushNotification(user.id, {
      title: 'Account Deleted',
      body: 'Your account has been deleted successfully.'
    });
  }
} 
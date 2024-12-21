import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { INotificationService } from '../interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { ValidationError } from '../../domain/errors/ValidationError';
import { User } from '../../domain/entities/User';

interface TokenPayload {
  userId: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthApplicationService {
  private readonly jwtSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
    this.accessTokenExpiration = '15m';
    this.refreshTokenExpiration = '7d';
  }

  async login(email: Email, password: Password): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      throw new ValidationError('Invalid credentials');
    }

    const isValid = await Password.compare(password.value, user.password);
    if (!isValid) {
      throw new ValidationError('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async register(data: {
    name: string;
    email: Email;
    password: Password;
  }): Promise<AuthResponse> {
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

    return this.generateAuthResponse(user);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        throw new ValidationError('Invalid refresh token');
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new ValidationError('Invalid refresh token');
    }
  }

  async logout(token: string): Promise<void> {
    // In a real application, you would blacklist the refresh token
    // For now, we'll just log the action
    this.logger.info('User logged out', { token });
  }

  async forgotPassword(email: Email): Promise<void> {
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      // Don't reveal if the email exists
      return;
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    // In a real application, you would:
    // 1. Store the reset token in the database
    // 2. Send an email with the reset link
    // For now, we'll just log it
    this.logger.info('Password reset requested', {
      userId: user.id,
      resetToken
    });

    await this.notificationService.sendPushNotification(user.id, {
      title: 'Password Reset Requested',
      body: 'A password reset has been requested for your account.'
    });
  }

  async resetPassword(token: string, newPassword: Password): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        throw new ValidationError('Invalid reset token');
      }

      user.password = newPassword.value;
      await this.userRepository.update(user);

      await this.notificationService.sendPushNotification(user.id, {
        title: 'Password Reset Successful',
        body: 'Your password has been reset successfully.'
      });
    } catch (error) {
      throw new ValidationError('Invalid reset token');
    }
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiration
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
} 
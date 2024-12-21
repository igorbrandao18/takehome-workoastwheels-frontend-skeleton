import { Request, Response, NextFunction } from 'express';
import { UserApplicationService } from '../../application/services/UserApplicationService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { INotificationService } from '../../application/interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';

export class UserController {
  private service: UserApplicationService;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {
    this.service = new UserApplicationService(
      userRepository,
      userDomainService,
      notificationService,
      logger
    );
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const user = await this.service.registerUser({
        name,
        email: new Email(email),
        password: await Password.create(password)
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.loginUser(
        new Email(email),
        new Password(password)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user!;
      const user = await this.service.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user!;
      const user = await this.service.updateUser(userId, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user!;
      const { currentPassword, newPassword } = req.body;
      await this.service.changePassword(
        userId,
        new Password(currentPassword),
        await Password.create(newPassword)
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user!;
      await this.service.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 
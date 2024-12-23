import { Request, Response, NextFunction } from 'express';
import { AuthApplicationService } from '../../application/services/AuthApplicationService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { INotificationService } from '../../application/interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';

export class AuthController {
  private service: AuthApplicationService;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {
    this.service = new AuthApplicationService(
      userRepository,
      userDomainService,
      notificationService,
      logger
    );
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(
        new Email(email),
        new Password(password)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const user = await this.service.register({
        name,
        email: new Email(email),
        password: await Password.create(password)
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.service.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      await this.service.logout(refreshToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.service.forgotPassword(new Email(email));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      await this.service.resetPassword(token, await Password.create(password));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 
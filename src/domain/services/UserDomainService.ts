import { User, UserRole, UserStatus } from '../entities/User';
import { ValidationError } from '../errors/ValidationError';

export class UserDomainService {
  validateUserCreation(user: User): void {
    if (!user.name || user.name.trim().length < 2) {
      throw new ValidationError('Name must have at least 2 characters');
    }

    if (!user.email || !this.isValidEmail(user.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!user.password || user.password.length < 8) {
      throw new ValidationError('Password must have at least 8 characters');
    }
  }

  validateStatusChange(user: User, newStatus: UserStatus): void {
    if (user.status === newStatus) {
      return;
    }

    if (user.status === 'BLOCKED' && !user.isAdmin()) {
      throw new ValidationError('Only admins can unblock users');
    }
  }

  validateRoleChange(currentUser: User, targetUser: User, newRole: UserRole): void {
    if (!currentUser.isAdmin()) {
      throw new ValidationError('Only admins can change user roles');
    }

    if (targetUser.isAdmin() && newRole !== 'ADMIN') {
      throw new ValidationError('Cannot demote the last admin');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 
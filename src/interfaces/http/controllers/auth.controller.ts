import { Request, Response } from 'express';
import { AuthService } from '../../../application/auth/services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.register({ name, email, password });
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.login({ email, password });
      return res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (error instanceof Error && error.message === 'Account is not active') {
        return res.status(403).json({ error: 'Account is not active' });
      }
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await authService.getProfile(userId);
      return res.json(profile);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 
import bcryptjs from 'bcryptjs';

export class Password {
  private constructor(private readonly value: string) {}

  static async create(password: string): Promise<Password> {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const hashedPassword = await bcryptjs.hash(password, 8);
    return new Password(hashedPassword);
  }

  static async fromHashed(hashedPassword: string): Promise<Password> {
    return new Password(hashedPassword);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcryptjs.compare(plainPassword, this.value);
  }

  toString(): string {
    return this.value;
  }
} 
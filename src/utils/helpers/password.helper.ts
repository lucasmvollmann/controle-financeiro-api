import * as argon2 from 'argon2';

export class PasswordHelper {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      secret: Buffer.from(process.env.ARGON_SECRET),
    });
  }

  async verify(hashPassword: string, plainPassword: string): Promise<boolean> {
    return argon2.verify(hashPassword, plainPassword, {
      secret: Buffer.from(process.env.ARGON_SECRET),
    });
  }
}

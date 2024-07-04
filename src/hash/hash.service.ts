import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}

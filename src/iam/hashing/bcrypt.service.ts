import * as bcrypt from 'bcrypt';
import { HashingService } from './hashing.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService implements HashingService {
  async hash(value: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(value, salt);
  }

  async compare(value: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(value, encrypted);
  }
}

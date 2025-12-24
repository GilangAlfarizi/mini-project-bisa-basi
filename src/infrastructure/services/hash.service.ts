import { IHashService } from '@application/services';
import * as bcrypt from 'bcryptjs';

export class HashService implements IHashService {
  hash(text: string): Promise<string> {
    const saltRounds = 10;

    return bcrypt.hash(text, saltRounds);
  }

  compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}

import { IIdGeneratorService } from '@application/services';
import { v7 as uuid } from 'uuid';

export class IdGeneratorService implements IIdGeneratorService {
  generateUniqueId(): string {
    return uuid();
  }
}

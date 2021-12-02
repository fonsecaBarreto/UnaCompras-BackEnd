import { v4 } from 'uuid'
import { IIdGenerator } from '@/domain/Interfaces/vendors';

export class UuidAdapter implements IIdGenerator {
     gen(): string {
          return v4()
     }
}
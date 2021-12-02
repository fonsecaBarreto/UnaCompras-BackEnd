import { IHasher } from "@/domain/Interfaces/vendors";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher {
    hash(value: string): string {
        return bcrypt.hashSync(value, 12)
    }
    compare(value: string, hash: string): boolean {
        return bcrypt.compareSync(value, hash)
    }
}
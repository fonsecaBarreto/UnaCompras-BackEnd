import { IHasher } from "@/domain/Interfaces/vendors"

export class HasherStub implements IHasher{
     hash(value: string): string {
          return "hashed_password"
     }
     compare(value: string, hash: string): boolean {
          return true
     }

}

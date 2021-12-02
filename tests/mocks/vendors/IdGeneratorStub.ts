import { IIdGenerator } from "@/domain/Interfaces/vendors"

export class IdGeneratorStub implements IIdGenerator {
     gen(): string {
          return "generated_id"
     }
}
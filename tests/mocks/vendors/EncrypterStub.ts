import { IEncrypter } from "@/domain/Interfaces/vendors"

export class EncrypterStub implements IEncrypter {
     async sign(payload: any): Promise<string> {
          return "generated_access_token"
     }
     async verify(token: string): Promise<any> {
          return {      
               account_id: "test_account_id",
               email: "any_email@mail.com",
               name: "any_name", 
               iat: 123456789,
               exp: 123456789
          }
     }
}
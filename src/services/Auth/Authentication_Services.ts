/* vendors adapters */
import { IEncrypter } from "@/domain/Interfaces/vendors/IEncrypter";
import { IHasher } from "@/domain/Interfaces/vendors/IHasher";
/* app services */
import { IAuthentication_Service } from "@/domain/Interfaces/auth/Authentication";
/* Repositories */
import { IUserRepository } from "@/domain/Interfaces/repositories/IUserRepository";
/* Models */
import { User } from "@/domain/Models/Views/User";
import { Account } from "@/domain/Models/Entities/Accounts";
import { AccountsServices } from "../Accounts/Companies/Companies_Services";

export class AuthenticationServices implements IAuthentication_Service{
     constructor(
          private readonly _usersRepository: Pick<IUserRepository, "findUser" | "findByEmail">,
          private readonly _hasher: IHasher,
          private readonly _encrypter: IEncrypter
     ){}

     public async generateToken(params: IAuthentication_Service.Params.generateToken ): Promise<string>{
          
          const { email, password } = params

            console.log("Mas esteve aqui")
          const accountExists: Partial<Account> = await this._usersRepository.findByEmail(email, ["id", "email", "name", "password" ]);
          if(!accountExists) return null

          const doesPasswordsMatch = await this._hasher.compare(password, accountExists.password)
          if(!doesPasswordsMatch) return null
 
          const payload_params:  IEncrypter.Params = {  
               account_id: accountExists.id, 
               email: accountExists.email,
               name: accountExists.name,
          }

          try{
               const token_str = await this._encrypter.sign(payload_params, 15);
               return token_str
          
          }catch(err){ return null } 
     }

     async authenticate(params: IAuthentication_Service.Params.authenticate): Promise<User> {

          const { access_token } = params;
          var decoded: IAuthentication_Service.TokenPayload;

          try{
               decoded = await this._encrypter.verify(access_token)
               if(!decoded?.account_id) return null
               // fazer a validação de tempo de sessão e etc
          } catch(err) { return null }     

          const user = await this._usersRepository.findUser(decoded.account_id)
          return user;    
     }
}
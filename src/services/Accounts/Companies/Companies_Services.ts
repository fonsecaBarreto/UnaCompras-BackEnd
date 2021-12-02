import { Account, AccountsRole } from "@/domain/Models/Entities/Accounts";
import { IHasher, IIdGenerator } from '@/domain/Interfaces/vendors'
import { IAccountRepository } from '@/domain/Interfaces/repositories'
import { AccountRoleIsInvalidError, CpfInUserError, EmailInUseError, PhoneInUseError, UserNotAllowedError, UserNotFoundError } from "@/domain/Models/Errors";

/* Views */
import { User } from "@/domain/Models/Views/User"

export namespace IAccountServices {
     export namespace Params {
          export type Create = Omit<Account, 'created_at' | 'updated_at' | 'id' | 'image_id'> 
          export type Update = { email: string, phone: string, cpf: string, name: string }
          export type UpdatePassword = { password: string } 
          export type isUserAvailable = { cpf: string, email: string, phone?: string }
     }
}

export interface IAccountsServices {
     create(params: IAccountServices.Params.Create): Promise<User>
     update(id:string, params: IAccountServices.Params.Create): Promise<User>
     updatePassword(id:string, params: IAccountServices.Params.UpdatePassword): Promise<User>
     find(id:string): Promise<User>
     remove(id:string): Promise<void>
}

const rolesList = Object.values(AccountsRole).filter(value => isNaN(Number(value)) === false);

export class AccountsServices implements IAccountsServices {

     constructor(
          private readonly _accountsRepository: IAccountRepository,
          private readonly _idGenerator: IIdGenerator,
          private readonly _hasher: IHasher
     ){}

     async isCredentialsAvailable( params: IAccountServices.Params.isUserAvailable, except_id?:string): Promise<boolean> {

          const { phone, email, cpf } = params

          const emailinUser = await this._accountsRepository.findByEmail(email);
          if(emailinUser && emailinUser.id !== except_id)
               throw new EmailInUseError();

          const documentExists = await this._accountsRepository.findByCpf(cpf)
          if(documentExists && documentExists.id !== except_id )
               throw new CpfInUserError();

          if(phone){   
               const phoneExists = await this._accountsRepository.findByPhone(phone);
               if(phoneExists && phoneExists.id !== except_id ) 
                    throw new PhoneInUseError();
          }

          return true;
      }

     public async create(params: IAccountServices.Params.Create ): Promise<User>{

          const { email, phone, role, password, cpf, name } = params

          if(!rolesList.includes(role))
               throw new AccountRoleIsInvalidError();

          await this.isCredentialsAvailable({ phone, email, cpf })
          
          const id = this._idGenerator.gen();

          const hashed_password = this._hasher.hash(password)

          const account: Account = { cpf, email, id, name, phone, role, password: hashed_password, image_id: null} 

          await this._accountsRepository.upsert(account); 

          const userView: User = new User(account)
          
          return userView
      
     }

     public async update(id:string, params: IAccountServices.Params.Update): Promise<User>{

          const { email, phone, cpf, name } = params;

          const account = await this._accountsRepository.findById(id);
          if(!account) 
               throw new UserNotFoundError();
     
          await this.isCredentialsAvailable({ phone, email, cpf }, id)

          account.name = name;
          account.email = email;
          account.phone = phone;
          account.cpf = cpf

          await this._accountsRepository.upsert(account);

          const userView: User = new User(account)

          return userView;
     }

     async updatePassword(id: string, params: IAccountServices.Params.UpdatePassword): Promise<User> {

          const account = await this._accountsRepository.findById(id);
          if(!account) 
               throw new UserNotFoundError();

          const { password } = params

          const hashed_password = this._hasher.hash(password)

          await this._accountsRepository.updatePassword(id, hashed_password); 

          account.password = hashed_password;
          const userView: User = new User(account)
          return userView;
     }

     async find(id:string): Promise<User>{
          const user: User = await this._accountsRepository.findUser(id)
          return user || null
     }
     
     public async remove(id:string): Promise<void>{
          const wasDeleted = await this._accountsRepository.remove(id)
          if(!wasDeleted) throw new UserNotFoundError()
     }

}
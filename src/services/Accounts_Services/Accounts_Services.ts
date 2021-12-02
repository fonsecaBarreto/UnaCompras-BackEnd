
import { Account, rolesList, IAccountServices, IAccountsServices, User } from './IAccounts_Services'
import { AccountRoleIsInvalidError, CpfInUserError, EmailInUseError, PhoneInUseError, UserNotFoundError } from "@/domain/Models/Errors";
import { IUserRepository } from "@/domain/Interfaces/repositories";
import { IHasher, IIdGenerator } from '@/domain/Interfaces/vendors'

export class AccountsServices implements IAccountsServices {
     constructor(
          private readonly _accountsRepository: IUserRepository,
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

    /*  async updatePassword(id: string, params: IAccountServices.Params.UpdatePassword): Promise<User> {

          const account = await this._accountsRepository.findById(id);
          if(!account) 
               throw new UserNotFoundError();

          const { password } = params

          const hashed_password = this._hasher.hash(password)

          await this._accountsRepository.updatePassword(id, hashed_password); 

          account.password = hashed_password;
          const userView: User = new User(account)
          return userView;
     } */

   /*   async find(id:string): Promise<User>{
          const user: User = await this._accountsRepository.findUser(id)
          return user || null
     }
      */
     public async remove(id:string): Promise<void>{
          const wasDeleted = await this._accountsRepository.remove(id)
          if(!wasDeleted) throw new UserNotFoundError()
     }

}
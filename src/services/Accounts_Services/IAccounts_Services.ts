import { Account, AccountsRole } from "@/domain/Models/Entities/Accounts";
import { User } from "@/domain/Models/Views/User"
export *  from "@/domain/Models/Views/User"
export *  from "@/domain/Models/Entities/Accounts"

export namespace IAccountServices {
     export namespace Params {
          export type Create = Omit<Account, 'created_at' | 'updated_at' | 'id' | 'image_id'> 
          export type Update = { email: string, phone: string, cpf: string, name: string }
          export type isUserAvailable = { cpf: string, email: string, phone?: string }
     }
}

export interface IAccountsServices {
     create(params: IAccountServices.Params.Create): Promise<User>
     update(id:string, params: IAccountServices.Params.Create): Promise<User>
/*      find(id:string): Promise<User> */
     remove(id:string): Promise<void>
}

export const rolesList = Object.values(AccountsRole).filter(value => isNaN(Number(value)) === false);

import { Account } from "@/domain/Models/Entities/Accounts/Account";
import { User } from "@/domain/Models/Views/User";
import { IUserRepository } from "@/domain/Interfaces/repositories/IUserRepository";
import KnexAdapter from './KnexAdapter';
import { PgBaseRepository } from "./PgBaseRepository";

export class PgUsersRepository extends PgBaseRepository<Account> implements IUserRepository {
     constructor( ){super("accounts")}

     async findByEmail(email: string, select?: string[]): Promise<Account | Partial<Account>> {
          const account: any = await KnexAdapter.connection('accounts')
          .where({'accounts.email':email})
          .select(select)
          .first();
          return account;
     }

     async findByPhone(phone: string, select?: string[]): Promise<Account | Partial<Account>> {
          const account: any = await KnexAdapter.connection('accounts')
          .where({'accounts.phone':phone})
          .select(select)
          .first();
          return account;
     }

     async findByCpf(cpf: string, select?: string[]): Promise<Account | Partial<Account>> {
          const account: any = await KnexAdapter.connection('accounts')
          .where({'accounts.cpf': cpf})
          .select(select)
          .first();
          return account;
     }

     async findUser(id: string): Promise<User> {

          const resultado: any = await KnexAdapter.connection('accounts')
               .where({'accounts.id':id})
               .first()

               /* .select([
                    "users.*", 
                    KnexAdapter.connection.raw("COALESCE (json_agg( add.* ) FILTER (WHERE add IS NOT NULL), '[]')  as address")
               ])
               .leftJoin('users_addresses AS ua', 'ua.user_id', "=", "users.id")
               .leftJoin('addresses AS add', 'ua.address_id', "=", "add.id")
               .groupBy("users.id") */

          if(!resultado) return null

          //const address = resultado.address.length > 0 ? resultado.address[0] : null
          //delete resultado.address

          return new User(resultado)
     }

     async upsert(account: Account): Promise<void> {
          await this._upsert( account, ['email', 'name', 'phone', 'cpf'])
          return 
     }

}


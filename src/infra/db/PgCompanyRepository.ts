import { Company } from "@/domain/Models/Entities/Companies";
import KnexAdapter from './KnexAdapter';

import { PgBaseRepository } from "./PgBaseRepository";
import { ICompanyRepository } from "@/domain/Interfaces/repositories";

export class PgCompanyRepository extends PgBaseRepository<Company> implements ICompanyRepository {
     constructor( ){super("companies")}

     async findByCnpj(cnpj: string): Promise<Company> {
           const account: any = await KnexAdapter.connection('companies')
          .where({'companies.cnpj': cnpj}).first();
          return account;
     }
  
     async findByMangerId(account_id: string): Promise<Company> {
          const account: any = await KnexAdapter.connection('companies')
          .where({'companies.manager_id': account_id}).first();
          return account;
     }

     async upsert(account: Company): Promise<void> {
          await this._upsert( account, ['trade_name', 'company_name','cnpj', 'financial_email'])
          return 
     }


}


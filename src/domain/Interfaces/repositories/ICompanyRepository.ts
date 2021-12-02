import { Company } from '@/domain/Models/Entities/Companies';
import { IBaseRepository } from './IBaseRepository'

export interface ICompanyRepository extends IBaseRepository<Company> {
     
     /* Comapny */
     findByCnpj(cnpj: string): Promise<Company>
     findByMangerId(account_id: string): Promise<Company>
}
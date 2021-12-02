/* app services */
import { IAuthorization_Service } from "@/domain/Interfaces/auth/Authorization";
/* Repositories */
import { ICompanyRepository } from "@/domain/Interfaces/repositories";
/* Models */
import { User, } from "@/domain/Models/Views/User";
import { CompanyType } from "@/domain/Models/Entities/Companies";
import { AccountsRole } from "@/domain/Models/Entities/Accounts";

export class AuthorizationServices implements IAuthorization_Service{
     constructor(
          private readonly _companyRepository: Pick<ICompanyRepository, "findByMangerId">,
     ){}

     async isAdmin(user: User): Promise<boolean> {
          if(user.role === AccountsRole.Admin) return true;
          return false;
     }

     async isVendor(user: User): Promise<boolean> {
          if(user.role !== AccountsRole.Client) return false;
          const companyRelated = await this._companyRepository.findByMangerId(user.id)
          if(!companyRelated || companyRelated.type !== CompanyType.Vendor) return false;
          return true;
     }

     async isCustomer(user: User): Promise<boolean> {
          if(user.role !== AccountsRole.Client) return false;
          const companyRelated = await this._companyRepository.findByMangerId(user.id)
          if(!companyRelated || companyRelated.type !== CompanyType.Customer) return false;
          return true;
     }
}
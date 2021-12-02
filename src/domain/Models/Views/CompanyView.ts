import { Company, CompanyType } from "@/domain/Models/Entities/Companies";
import { AddressView } from "./AddressView";

export class CompanyView implements Company{
   
     id: string;
     created_at?: Date;
     updated_at?: Date;
     // chaves estrangeiras
     address_id: string;
     manager_id: string;
     // propriedades
     company_name: string;
     trade_name: string;
     cnpj: string;
     financial_email: string;
     AgreedToPrivacyTerms: boolean;
     type: CompanyType;
     // relacionamentos
     address: AddressView
  
     constructor(company: Company, address: AddressView = null){
          Object.assign(this,{...company})
          this.address = address
     }     
     
     toObject(){
          const object = { ...this }
          return object
     }

}


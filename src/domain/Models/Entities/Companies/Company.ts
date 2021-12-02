import { BaseEntity } from "../BaseEntity"

export enum CompanyType{
     Customer = 1,
     Vendor = 2
}

export interface Company extends BaseEntity{
     address_id:string,
     manager_id:string,
     company_name: string;
     trade_name: string;
     cnpj: string;
     financial_email: string;
     agreedToPrivacyTerms: boolean;
     type: CompanyType;
}


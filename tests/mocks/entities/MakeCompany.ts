import { v4 } from "uuid";
import { Company, CompanyType } from "@/domain/Models/Entities/Companies";
import faker from 'faker'
export function MakeFakeCompany(params?: Partial<Company>): Company {
     return ({
          id: v4(),
          agreedToPrivacyTerms: true, 
          address_id: "any_address_id", 
          cnpj:  Math.random() * 100 + Math.random() * 100 + Math.random() * 100  + "",
          company_name:  faker.company.companyName(),
          trade_name: faker.company.companySuffix() + faker.company.catchPhraseNoun(),
          financial_email: faker.internet.email(),
          manager_id: "manager_id",
          type: CompanyType.Customer,
          updated_at: new Date(),
          created_at: new Date(), 
          ...params
     })
}
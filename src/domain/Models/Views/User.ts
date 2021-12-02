import { Account, AccountsRole } from "@/domain/Models/Entities/Accounts";
import { CompanyView } from "./CompanyView";

// Usuario Base
export class User implements Omit<Account,'password'>{
   
     id: string;
     created_at?: Date;
     updated_at?: Date;

     name: string;
     email: string;
     phone: string;
     cpf: string;
     image: string;
     role: AccountsRole
     
     constructor(user: Account){
          const params = { ...user }
          if(params.password){ delete params.password } // strict info
          Object.assign(this,{...params})
     }     

     toJson(){ return JSON.stringify( { ...this }); }
}

// Admin
export class AdminView extends User{
     constructor(user: Account){
          super(user);
     }
}

//Clientes
export class Client extends User{
     company: CompanyView
     constructor(user: Account, company: CompanyView){
          super(user);
          this.company = company;
     }
}

//Mercado
export class Customer extends Client { 
     constructor(user: Account, company: CompanyView){
          super(user, company);
     }
}

// Fornecedor
export class Vendor extends Client {
     constructor(user: Account, company: CompanyView){
          super(user, company);
     }
}




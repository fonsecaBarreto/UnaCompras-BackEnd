import { Address } from "@/domain/Models/Entities/Companies";
import { LabelViewStr } from "./Utils";

export class AddressView implements Address{
   
     id: string;
     created_at?: Date;
     updated_at?: Date; 

     street: string;
     number: string;
     details: string;
     district: string;
     city: string;
     uf: string;
     postalCode: string;
  
     constructor(address: Address){
          Object.assign(this, { ...address })
     }    
     
     toObject(){ return { ...this };  }

     toLabelView(): LabelViewStr{
          return ({ 
              value: this.id,
              label: `${this.street}, ${this.number}; ${this.district}, ${this.city} - ${this.uf} (${this.postalCode})`
          })
     } 
}


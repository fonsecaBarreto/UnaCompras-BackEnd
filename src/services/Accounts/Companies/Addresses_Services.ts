
import { Address } from "@/domain/Models/Entities/Companies";
import { AddressNotFoundError, AddressUfInvalidError } from "@/domain/Models/Errors";
import { IAddressRepository } from "@/domain/Interfaces/repositories";
import { IIdGenerator } from "@/domain/Interfaces/vendors";
import { AddressView } from "@/domain/Models/Views/AddressView";
import ufs from './ufs.json'

const ufs_prefixs = Object.values(ufs);

export namespace IAddressesServices {
     export namespace Params {
          export type Create = Omit<Address, 'id' | 'created_at' | 'updated_at'>
          export type Update = Create;
     } 
}

export interface IAddressesServices {
     create(params: IAddressesServices.Params.Create): Promise<AddressView>
     update(id:string, address:  IAddressesServices.Params.Create): Promise<AddressView> 
     //find(id:string): Promise<AddressView>
     remove(id:string): Promise<void>
}

export class AddressesServices implements IAddressesServices {
     constructor(
          private readonly _addressRepository: Omit<IAddressRepository,'isUserRelated'>,
          private readonly _idGenerator: IIdGenerator
     ){}

     public async create(params: IAddressesServices.Params.Create): Promise<AddressView> {

          var { uf } = params;
      
          uf = params.uf.toUpperCase();
          if(!ufs_prefixs.includes(uf))  throw new AddressUfInvalidError(); 

          const id = await this._idGenerator.gen();
          
          const address: Address = { ...params, id, uf };
          
          await this._addressRepository.upsert(address);

          return new AddressView(address);
     }

     public async update(id:string, params: IAddressesServices.Params.Update): Promise<AddressView> {

          var { uf } = params;

          const addressExists = await this._addressRepository.findById(id);
          if(!addressExists) 
               throw new AddressNotFoundError();
     
          uf = params.uf.toUpperCase();
          if(!ufs_prefixs.includes(uf))  throw new AddressUfInvalidError(); 
          
          const address: Address = { ...params, id, uf }
          
          await this._addressRepository.upsert(address);

          return new AddressView(address);
     }

     public async remove(id:string): Promise<void>{
          const wasDeleted = await this._addressRepository.remove(id)
          if(!wasDeleted) throw new AddressNotFoundError()
     }


    /*  public async find(id:string): Promise<AddressView>{
          const address: AddressView = await this._addressRepository.findAddress(id)
          return address;
     }

     public async list(): Promise<Address[]>{ //Quando precisar listar o endereço para a listview por exemplo
          const addresses: Address[] = await this._addressRepository.list()
          return addresses.length > 0 ? addresses : [];
     } */
}
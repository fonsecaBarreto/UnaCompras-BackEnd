import ApplicationError from "./ApplicationError";

export class AddressNotFoundError extends ApplicationError {
     constructor(){
          super("AddressNotFoundError","Endereço nao encontrado.")
     }
}

export class AddressUfInvalidError extends ApplicationError {
     constructor(){
          super("AddressUfInvalidError","UF desconhecido.")
     }
}
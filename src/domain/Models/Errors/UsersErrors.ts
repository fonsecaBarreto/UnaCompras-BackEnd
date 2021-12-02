import ApplicationError from "./ApplicationError";

// 404 Usuario Não encontrado 
export class UserNotFoundError extends ApplicationError {
     constructor(){
          super("UserNotFoundError","Usuário não encontrado")
     }
}

// 403
export class UserNotAllowedError extends ApplicationError {
     constructor(){
          super("UserNotAllowedError","Usuário inelegível para realizar essa interação")
     }
}

// 400 Tipo de Usuario inválido
export class AccountRoleIsInvalidError extends ApplicationError {
     constructor(){
          super("AccountRoleIsInvalidError", "Tipo de Usuário desconhecido")
     } 
} 

// 400 E-mail em uso
export class EmailInUseError extends ApplicationError {
     constructor(){
          super("EmailInUseError",`Este E-mail já está em uso`)
     }
}

// 400 Cnpj em uso
export class CpfInUserError extends ApplicationError {
     constructor(){
          super("CpfInUserError",`Já existe Conta cadastrada para esse CPF`)
     }
}

// 400 Telefone em uso
export class PhoneInUseError extends ApplicationError {
     constructor(){
          super("PhoneInUseError",`Número de telefone já está em uso`)
     }
}

// 400 Razão social em uso
export class CompanyNameInUseError extends ApplicationError {
     constructor(){
          super("CompanyNameInUseError",`Razão social já está em uso"`)
     }
}

// Usuario não verificado
export class UserNotVerifiedError extends ApplicationError {
     constructor(){
          super("UserNotVerifiedError",`Aguarde a Validação da conta. Você recebera um E-mail em breve`)
     }
}
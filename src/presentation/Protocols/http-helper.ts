import { ErrorSchema } from "@/domain/Models/Schemas/Properties/Errors"

//Factory 

const MakeError = (msg: string, params? : Record<string, any>): ErrorSchema => {
    return ({
        error: {
            message: msg,
            params
        }
    })
}
  
// Sucesses
export const Ok = (body?: any) =>{
    return { status: body ? 200 : 204, body }
}

// Conflicts
export const ServerError = () =>{
    return { status: 500, body: MakeError("Erro no servidor.")}
}

export const Unauthorized = () =>{
    return { status: 401, body: MakeError("Acesso Negado!") }
}

export const Forbidden = (error: Error | string) => {
    const msg = typeof error === "string" ? error : error.message
    return { status: 403, body: MakeError(msg) }
} 

export const BadRequest = (error: Error | string) => {
    const msg = typeof error === "string" ? error : error.message
    return { status: 400, body: MakeError(msg)  }
} 

export const NotFound = (error?: Error | string) => {
    const msg = error ? (typeof error === "string" ? error : error.message) : undefined
    return { status: 404, body: MakeError(msg) }
} 

export const Unprocessable = ( params: Record<string, any>, message?:string) => {
    return { status: 422, body: MakeError( message || "Preencha todos os campos corretamente!", params) }
} 


/* export const Download = (stream: any, headers: any) =>{
    return { status: 200, stream, headers }
} */
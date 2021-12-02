import ApplicationError from "./ApplicationError";

export class MissingFileBufferError extends ApplicationError {
     constructor(){
          super("FileNotFoundError","Arquivo não encontrado.")
     }
}

/* export const InvalidFileBufferError = (types:string[], limit: number, param: string, fileName:string ) => {
     const list = types.map(t=>(` .${t.substring(t.lastIndexOf("/")+1, t.length )}`)) 
     const limitMb = (limit / (1024 * 1024 )).toFixed(2);
     const message = `Somente arquivos (${ list} ) com tamanho maximo de ${limitMb} Mb.`
     return new ApplicationError('InvalidFileBufferError',  message, { [param]: fileName })
}
  */
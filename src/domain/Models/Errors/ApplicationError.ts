
export default class ApplicationError extends Error{
     constructor(name:string, message:string){
       super(message)
       this.message = message
       this.name = name
       Object.setPrototypeOf(this, ApplicationError.prototype);
     }
}
   

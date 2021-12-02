import { IValidator as SchemaValidator } from "@/domain/Interfaces/vendors/IValidator"
export { IValidator as SchemaValidator } from "@/domain/Interfaces/vendors/IValidator"

export default class AppSchemaValidator implements SchemaValidator{

  constructor(){}

  public async validate( schema: SchemaValidator.Schema, body: SchemaValidator.Params): Promise< SchemaValidator.Errors>  {

    this.sanitize(schema, body)

    var params: SchemaValidator.Errors = {}
 
    Object.keys(schema.properties).map( field => {

      const { type, description } = schema.properties[field] 
      const value = body[field]

      if ( value === null ){ 
        if( !schema.required.includes(field)) return;

        return params[field]= makeMissingMessage(description|| field)
      } 

      let IsTypeValid = this.checkType( value, type )
      if(IsTypeValid === false) return params[field] = makeInvalidMessage(description || field) 
    
    }) 

    return Object.keys(params).length > 0 ? params : null; 
    //test it
  }

  private sanitize (schema: SchemaValidator.Schema, body: Record<string,any>) {

    Object.keys(body).map( param => { if(!schema.properties[param]){ delete body[param] } })
    
    var initialBody = { ...body } // clone body

    Object.keys(schema.properties).forEach( field => {

      var value = initialBody[field]
      if(value === undefined || value === "" || value == null ) return body[field] = null

      const { type } = schema.properties[field]
      var final_value: any = value; 

      switch(type){
        case "cep": final_value = (value+"").replace(/[^\d]+/g,''); break;
        case "number": { if(!isNaN(value)) final_value = Number(value); };break;
        case "date": if(!isNaN(Date.parse(value))) final_value = new Date(value); break;
        case "boolean": try{ final_value = JSON.parse(value)} catch(err){final_value = value}; break;
      }

      return body[field] = final_value 
  
    }) 
  }

  private checkType( value:any, type:string): boolean{
 
    switch(type){

      case "uuid" :{
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regexExp.test(value)) return false
      };break;

      case "json" :{
        try { JSON.parse(value); } catch (e) { return false }
      };break;

      case "cep" : {
        const regex = /\b\d{8}\b/;
        if(!regex.test(value)) return false
      };break;

      case "date" : 
        if( !(value instanceof Date) ) return false
      ;break;
    
      case "hour" : var regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
          if(!regex.test(value)) return false;
      break;

      case "array": if( Array.isArray(value) === false ) return false; break;

      default: if(type !== typeof value) return false; break;

    }

    return true
  }

}

export const makeMissingMessage = (field: string, missingMessage?: string) => {
  return missingMessage || `Campo '${field}' é obrigatório`
}

export const makeInvalidMessage = (field: string, invalidMessage?:string) => {
  return invalidMessage || `Campo '${field}' contem valor inválido `
}
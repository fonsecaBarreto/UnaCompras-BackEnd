import { SchemaBuilder as SB } from "./ISchemaBuilder";
export * from './ISchemaBuilder'

export default class AppSchemaBuilder implements SB {
 
     private properties: SB.Properties = {};
     private required: string[]=[];

     setProperty(key:string, type?: string): SB.PropertiesHandler{

          if(!this.properties[key]){
               this.properties[key] = { type }
               this.required.push(key)
               return this.setProperty(key, type)
          }
   
          const optional = (): SB.PropertiesHandler =>{
               this.required.splice(this.required.indexOf(key),1)
               return this.setProperty(key)
          }

          const description = (value: string): SB.PropertiesHandler =>{
               this.properties[key] = { ...this.properties[key], description: value}
               return this.setProperty(key)
          }

          const actions: SB.PropertiesHandler = { optional, description };

          if(!this.required.includes(key)) delete actions.optional
          if(this.properties?.[key]?.description) delete actions.description
          return actions
     }

     number = (key: string): SB.PropertiesHandler => this.setProperty(key,'number')
     boolean = (key: string): SB.PropertiesHandler => this.setProperty(key,'boolean')
     date = (key: string): SB.PropertiesHandler => this.setProperty(key,'date')
     hour = (key: string): SB.PropertiesHandler => this.setProperty(key,'hour')
     array = (key: string): SB.PropertiesHandler => this.setProperty(key,'array')
     json = (key: string): SB.PropertiesHandler => this.setProperty(key,'json')
     cep = (key: string): SB.PropertiesHandler => this.setProperty(key,'cep')
     uuid = (key: string): SB.PropertiesHandler => this.setProperty(key,'uuid')
     string= (key:string): SB.PropertiesHandler => this.setProperty(key,'string')
  
     public getSchema(): SB.Schema{
          return ({
               type: 'object',
               properties: this.properties,
               required: this.required
          }) 
     }

     static create(callback: (instance: AppSchemaBuilder) => void): SB.Schema{
          const instace =  new AppSchemaBuilder();
          callback(instace)
          return instace.getSchema()
     }
}


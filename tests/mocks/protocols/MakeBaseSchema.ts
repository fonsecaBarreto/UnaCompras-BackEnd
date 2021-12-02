import { BaseSchema } from '@/domain/Models/Schemas/BaseSchema'

export const MakeFakeBaseSchema = (properties?:BaseSchema.Properties, clear: boolean = false): BaseSchema =>{
     return ({
          type: "object",
          properties: clear ? { ...properties} : {
               name: {
                    type: "string",
                    description: "Nome Teste"
               },
               age: {
                    type: "number",
                    description: "Idade Teste"
               },
               aniversary: {
                    type: "date",
               },
               ...properties
          },
          required: clear ? [ ...Object.keys(properties)] : ["name", "age"]
     })
}
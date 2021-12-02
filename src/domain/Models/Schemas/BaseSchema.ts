export namespace BaseSchema {

     export interface Property { 
          type: string,
          description?: string
     }
     
     export type Properties = Record<string, Property> 
}

export interface BaseSchema {
    type: string,
    properties: BaseSchema.Properties,
    required: string[]
}

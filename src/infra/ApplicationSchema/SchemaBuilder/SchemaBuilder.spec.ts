import SchemaBd, { SchemaBuilder } from './SchemaBuilder'

describe("Schema builder", () =>{

     test("Should cretae a schema", () =>{

          const schema = SchemaBd.create( (s: SchemaBuilder ) => {
               s.string("name")
          })   
          expect(schema).toEqual({
               type: 'object',
               properties: {
                    name: { type: "string" },
               },
               required: ["name"]
          }) 
     })
     test("Should cretae a optional param", () =>{
          const schema = SchemaBd.create( (s: SchemaBuilder) => {
               s.string("name").optional()
          })   
          expect(schema).toEqual({
               type: 'object',
               properties: {
                    name: { type: "string" },
               },
               required: []
          }) 
     })

     test("Should description to params", () =>{
          const schema = SchemaBd.create( (s: SchemaBuilder) => {
               s.string("name").optional().description("Descrição para o meu nome")
               s.string("nickName").description("Apelido")
          })   
          expect(schema).toEqual({
               type: 'object',
               properties: {
                    name: { type: "string", description: "Descrição para o meu nome" },
                    nickName: { type: "string", description: "Apelido" },
               },
               required: ['nickName']
          })
         
     })

     test("Should create a schema", () =>{
          const schema = SchemaBd.create( (s: SchemaBuilder) => {
               s.string("name")
               s.number("age")
               s.boolean("isAdmin")
               s.date("birthday")
               s.array("some_list")
               s.json("my_object")
               s.cep("cep")
               s.uuid("user_id")
          })   

          expect(schema).toEqual({
               type: 'object',
               properties: {
                    name: { type: "string" },
                    age: { type: "number" },
                    isAdmin: { type: "boolean" },
                    birthday: { type: "date" },
                    some_list: { type: "array" },
                    my_object: { type: "json" },
                    cep: { type: "cep" },
                    user_id: { type: "uuid" }
               },
               required: ["name","age","isAdmin", "birthday", "some_list", "my_object", "cep", "user_id"]
          })
     }) 

})
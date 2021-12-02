import SchemaBd, { SchemaBuilder } from '@/infra/ApplicationSchema/SchemaBuilder/SchemaBuilder'

export const SignIn_Schema = SchemaBd.create( (s: SchemaBuilder )=> {
  s.string("emailOrPhone").description("E-mail do Usuário")
  s.string("password").description("Senha de acesso")
});


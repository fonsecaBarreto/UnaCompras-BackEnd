
import AppSchemaValidator from '@/infra/ApplicationSchema/SchemaValidator/SchemaValidator'
import KnexAdapter from '@/infra/db/KnexAdapter';

import { EnviromentVariables } from '@/main/config/keys';

import BaseController from '@/presentation/Protocols/BaseController/BaseController';
import { AuthorizationServices } from '@/services/Auth/Authorization_services';
import { PgCompanyRepository } from '@/infra/db/PgCompanyRepository'


export default async function SingletonConfig (keys: EnviromentVariables){

     console.log("\nIniciando as dependencias ...")

     await KnexAdapter.open(keys.NODE_ENV);                   /* GSDB */
     const companyRepository = new PgCompanyRepository()      /* Repository */

     /* Base Controller Depedencies */
     BaseController._validator = new AppSchemaValidator();
     BaseController._authorizator = new AuthorizationServices(companyRepository);
     
}

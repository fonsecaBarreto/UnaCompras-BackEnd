/* main */
import { EnviromentVariables } from '@/main/config/keys';
/* Services */
import { AuthenticationServices } from '@/services/Auth/Authentication_Services'
/* Controllers */
import { AuthenticationMiddleware } from '@/presentation/Middlewares/Authentication.Middlewares'
/* Implementations */
import { PgUsersRepository } from '@/infra/db/PgUserRepository';
import { BcryptAdapter } from '@/infra/adapters';
import JsonWebTokenAdapter from '@/infra/adapters/JsonWebTokenAdapter';

export const MakeAuthenticationMidleware =(keys: EnviromentVariables) =>{

     const hasher = new BcryptAdapter();
     const encrypter = new JsonWebTokenAdapter(keys.JWT_SECRET);
     const usersRepository = new PgUsersRepository()
     const authenticationService = new AuthenticationServices(usersRepository, hasher, encrypter)

     /* Controllers */
     const authenticationMiddleware = new AuthenticationMiddleware(authenticationService);
     return authenticationMiddleware

}
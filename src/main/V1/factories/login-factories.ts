
/* main */
import { EnviromentVariables } from '@/main/config/keys';
/* Services */
import { AuthenticationServices } from '@/services/Auth/Authentication_Services'

/* Implementations */
import { PgUsersRepository } from '@/infra/db/PgUserRepository';
import { BcryptAdapter } from '@/infra/adapters';
import JsonWebTokenAdapter from '@/infra/adapters/JsonWebTokenAdapter';
/* Controllers  */
import { LoginController } from '@/presentation/Controllers/Login.Controllers'

export const MakeLoginController = (keys: EnviromentVariables ) => {

    const hasher = new BcryptAdapter();
    const encrypter = new JsonWebTokenAdapter(keys.JWT_SECRET);
    const usersRepository = new PgUsersRepository()
    const authenticationService = new AuthenticationServices(usersRepository, hasher, encrypter)

     const loginController = new LoginController(authenticationService);
     return loginController;
}


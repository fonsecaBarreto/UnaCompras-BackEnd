import getApp from './config/app'
import { EnviromentVariables } from './config/keys';

async function main() {
     const app = await getApp();
     const keys: EnviromentVariables = app.get('keys')
     app.listen(keys['PORT'], () =>{
          console.log("\n Server is running\n  - PORT:", keys.PORT,"\n  - ENV.:", keys.NODE_ENV," \n")
     })
}

main();


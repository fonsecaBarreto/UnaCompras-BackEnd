import getApp from './config/app'

async function main() {

     const app = await getApp();
     const keys = app.get('keys')


     app.listen(keys['PORT'], () =>{
          console.log("....................")
          console.log(" Server is running")
          console.log("  - PORT:", keys.PORT)
          console.log("  - ENV.:", keys.NODE_ENV)
          console.log("....................\n")
     })

}

main();


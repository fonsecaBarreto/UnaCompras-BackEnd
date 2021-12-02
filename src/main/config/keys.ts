import { config } from "dotenv";

export interface EnviromentVariables {
     PORT: string,
     NODE_ENV: string
     JWT_SECRET: string,
     REACT_CLIENT: string,
     EMAIL_CONFIG: {
          EMAIL_ADDRESS: string,
          EMAIL_PASSWORD: string,
          HOOK_EMAIL: string
     }
     AWS_CONFIG: {
          AWS_ACCESS_KEY: string,
          AWS_REGION:  string,
          AWS_SECRET_KEY:  string,
          AWS_UPLOADS_BUCKET:  string
     }
}

export default (): EnviromentVariables =>{
     config();
     return {
          PORT: process.env.PORT || '9000',
          NODE_ENV: process.env.NODE_ENV || "development",
          JWT_SECRET: process.env.JWT_SECRET || 'TEST_123',
          REACT_CLIENT: process.env.REACT_CLIENT,
          EMAIL_CONFIG: {
               EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
               EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
               HOOK_EMAIL: process.env.HOOK_EMAIL
          },
          AWS_CONFIG: {
               AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
               AWS_REGION: process.env.AWS_REGION,
               AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
               AWS_UPLOADS_BUCKET: process.env.AWS_UPLOADS_BUCKET,
          }
     }
}



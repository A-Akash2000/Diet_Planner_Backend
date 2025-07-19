import dotenv from 'dotenv';
dotenv.config({ path: `src/env/.env.${process.env.ENVIRONMENT || 'local'}` });

console.log("Env :", process.env.ENVIRONMENT)

interface Config {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWTKEY: string;
  ENCRYPTION_KEY: string;
  HOSTMAIL: string;
  PORTMAIL: number;
  PASSMAIL: string;
  SENDGRID_API_KEY:string;
  API_URL:string;
}

const config = Object.freeze({
  PORT: process.env.PORT || 5555,
  NODE_ENV: process.env.MODE_ENV || "local",
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/clinicaltrial",
  JWTKEY: process.env.JWTKEY || "",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "",
  HOSTMAIL: process.env.HOSTMAIL || "",
  PORTMAIL: process.env.PORTMAIL || "",
  PASSMAIL: process.env.PASSMAIL || "",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  API_URL : process.env.API_URL || ''
});


export default config;

declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    PORT: string;
    SECRET_JWT: string;
    PASSWORD: string;
  }
}

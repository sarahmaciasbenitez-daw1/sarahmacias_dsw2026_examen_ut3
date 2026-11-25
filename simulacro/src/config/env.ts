process.loadEnvFile();

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  APP_NAME: process.env.APP_NAME ?? 'connectia',
  LOG: process.env.LOG ?? 'ON',
};

export const env = {
  port: Number(process.env.PORT ?? 29503),
  dbHost: process.env.DB_HOST ?? "localhost",
  dbPort: Number(process.env.DB_PORT ?? 3306),
  dbName: process.env.DB_NAME ?? "app",
  dbUser: process.env.DB_USER ?? "app",
  dbPassword: process.env.DB_PASSWORD ?? "app_pwd",
  jwtSecret: process.env.JWT_SECRET ?? "change_me",
};

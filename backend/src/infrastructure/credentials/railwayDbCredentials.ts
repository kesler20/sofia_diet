export default {
  host: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_PRIVATE_DOMAIN}}:3306/${process.env.DB_NAME}`,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

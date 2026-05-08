import { Sequelize } from "sequelize";
const requiredEnv = ["DB_HOST", "DB_USER", "DB_PORT", "DB_DATABASE", "DB_PASSWORD"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing env var: ${env}`);
  }
});

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // disable SSL verification
      },
    },
  },
);

export default sequelize;

// importar libreria dotenv para manejar archivos .env
import dotenv from 'dotenv';
// cargar variables de entorno antes de iniciar app y db
dotenv.config();

const requiredEnv = [
  'DB_HOST',
  'DB_USER',
  'DB_PORT',
  'DB_DATABASE',
  'DB_PASSWORD',
  'ACCESS_TOKEN_SECRET',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
});

export const env = {
  port: process.env.PORT || 3000,

  nodeEnv: process.env.NODE_ENV || 'development',

  frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  corsOrigins: [
    'http://localhost:5173',
    'https://bajovigilancia.com',
    'https://www.bajovigilancia.com',
    'http://localhost:3000',
  ],

  jwtSecret: process.env.ACCESS_TOKEN_SECRET,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',

    apiKey: process.env.CLOUDINARY_API_KEY || '',

    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  db: {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true',
  },
  seed: {
    runSeed: process.env.RUN_SEED,
    adminEmail: process.env.SEED_ADMIN_EMAIL,
    adminPassword: process.env.SEED_ADMIN_PASSWORD,
  },
};

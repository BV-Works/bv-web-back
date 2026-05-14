// IMPORTACIONES
// importar servidor express (framework de node.js)
import express from 'express';
// importar config de variables de entorno
import { env } from './config/env.js';
// BORRAR antes de prod: importar instancia sequelize para healthcheck y comprobacion de DB
import sequelize from './config/db_pg.js';
// importar morgan para console.log de las peticiones al servidor para facilitar el desarrollo y debugging
import morgan from 'morgan';
// importar helmet para proteger cabeceras security (headers middleware)
import helmet from 'helmet';
// importar cookie parser para manejar cookies
import cookieParser from 'cookie-parser';

// importar CORS para seguridad: permite controlar qué recursos web pueden ser solicitados por un origen diferente.
import cors from 'cors';
// importar limiter para limitar las peticiones al servidor
import rateLimit from 'express-rate-limit';
// importar manejo de errores personalizado
import { errorHandler, notFound } from './middlewares/error.middleware.js';


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP dentro del tiempo de ventana
  message: 'Demasiadas solicitudes. Por favor intente nuevamente más tarde.',
});

//Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
// const fs = require("fs");

const app = express();

//--------------------------------------
// DECLARACIONES DE USO EN NUESTRA APP:

app.use(express.json()); // para usar objetos en formaro json en las request
app.use(morgan('dev'));

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(
  cors({
    origin: env.corsOrigins, // Ajusta esto a tu frontend URL origin: ,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Si necesitas enviar cookies o tokens de autenticación
  }),
);

// de momento comentado para que no moleste durante desarrollos:
// app.use(limiter);

app.use(helmet()); // Helmet para proteger contra ataques de tipo xss
app.use(cookieParser()); // Parsear las cookies que vienen en las cabezeras http: "It simplifies managing user sessions, authentication tokens, and preferences by converting raw request cookie headers into easily accessible JSON objects."

// --------------------------------------
// RUTAS:

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import profilesRoutes from './routes/profiles.routes.js';
import systemRoutes from './routes/system.routes.js';

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/profiles', profilesRoutes);
app.use('/system', systemRoutes);
// --------------------------------------
// RUTAS DE PRUEBA:

app.get('/', (_req, res) => {
  res.redirect('/system/health');
});

// --------------------------------------
// Manejo de errores
// 404
app.use(notFound);
// 500
app.use(errorHandler);

// --------------------------------------
// Seguridad runtime
process.on('unhandledRejection', (err) => {
  //captura errores no controlados en promesas (awaits sin try/catch)
  console.error('Unhandled Rejection:', err);
  // En producción, es recomendable reiniciar el proceso después de una excepción no controlada para evitar estados inconsistentes.
  if (env.nodeEnv === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  // captura errores sin try/catch en código síncrono.
  console.error('Uncaught Exception:', err);
  // En producción, es recomendable reiniciar el proceso después de una excepción no controlada para evitar estados inconsistentes.
  if (env.nodeEnv === 'production') {
    process.exit(1);
  }
});

export default app;

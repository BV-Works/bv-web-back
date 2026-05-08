// IMPORTACIONES
// importar servidor express (framework de node.js)
import express from "express";
// BORRAR antes de prod: importar instancia sequelize para healthcheck y comprobacion de DB
import sequelize from "../config/db_pg.js";
// importar morgan para console.log de las peticiones al servidor para facilitar el desarrollo y debugging
import morgan from "morgan";
// importar helmet para proteger cabeceras security (headers middleware)
import helmet from "helmet";
// importar cookie parser para manejar cookies
import cookieParser from "cookie-parser";

// import bodyParser from "body-parser"; ?????????????


// importar CORS para seguridad: permite controlar qué recursos web pueden ser solicitados por un origen diferente.
import cors from "cors";
// importar limiter para limitar las peticiones al servidor

import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP dentro del tiempo de ventana
  message: "Demasiadas solicitudes. Por favor intente nuevamente más tarde.",
});


//Swagger
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
// const fs = require("fs");

const app = express();

//--------------------------------------
// DECLARACIONES DE USO EN NUESTRA APP:

app.use(express.json()); // para usar objetos en formaro json en las request
app.use(morgan("dev"));

app.use(cors()); // CORS para que se pueda consumir el API desde cualquier origen (localhost:4200)
// config cors mas adelante: configuracion CORS necesaria para envio de cookies/JWT entre frontend y backend
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000', // Ajusta esto a tu frontend URL origin: ,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Si necesitas enviar cookies o tokens de autenticación
//   optionsSuccessStatus: 204,
// }));

// de momento comentado para que no moleste durante desarrollos:
// app.use(limiter);

app.use(helmet()); // Helmet para proteger contra ataques de tipo xss
app.use(cookieParser()); // Parsear las cookies que vienen en las cabezeras http: "It simplifies managing user sessions, authentication tokens, and preferences by converting raw request cookie headers into easily accessible JSON objects."
// app.use(bodyParser.urlencoded({ extended: true })); // Para usar objetos en formaro json en las request

// --------------------------------------
// RUTAS DE NUESTRA APP:

// esto lo comentamos xq solo lo teniamos al principio para probar que funcionaba, ahora queremos que la primera ruta en la que se entra en la app sea home
app.get("/", (_req, res) => {
  res.json({ message: "funciona" });
});

app.get("/health", async (_req, res) => {
  try {
    await sequelize.authenticate();

    return res.status(200).json({
      status: "ok",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// --------------------------------------
// Manejo de errores
// 404
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // si la ruta que da error es de /api (parte BE) devuelve 404 en formato json
    return res.status(404).json({ message: "Ruta no encontrada" });
  }
});

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (req.originalUrl.startsWith("/api")) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

// --------------------------------------
// Seguridad runtime
process.on("unhandledRejection", (err) => {
  //captura errores no controlados en promesas (awaits sin try/catch)
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  // captura errores sin try/catch en código síncrono.
  console.error("Uncaught Exception:", err);
});

export default app;

import app from "./app.js";
// importar libreria dotenv para manejar archivos .env
import dotenv from "dotenv";
// cargar variables de entorno antes de iniciar app y db
dotenv.config();
// Definimos puerto
const PORT = process.env.PORT || 3000;
// importar config de bbdd
import sequelize from "../config/db_pg.js";
// Start server and bbdd
const startServer = async () => {
  try {
    // await sequelize.authenticate() // encender base de datos

    // console.log("Database connected");

    // await sequelize.sync({ force: false });
    // console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`API listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();

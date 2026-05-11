import { env } from "./config/env.js";
import app from "./app.js";
// Definimos puerto
const PORT = env.port || 3000;
// importar config de bbdd
import sequelize from "./config/db_pg.js";
// Start server and bbdd
const startServer = async () => {
  try {
    await sequelize.authenticate() // encender base de datos

    console.log("Database connected");

    await sequelize.sync({ force: false });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`API listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();

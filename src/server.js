import { env } from './config/env.js';
import app from './app.js';
import './models/index.js';
import { runSeed } from './seed.js';
// Definimos puerto
const PORT = env.port || 3000;
// importar config de bbdd
import sequelize from './config/db_pg.js';
// Start server and bbdd
const startServer = async () => {
  try {
    await sequelize.authenticate(); // encender base de datos

    console.log('Database connected');
    await sequelize.sync({ alter: true }); // eliminar esto despues de desarrollo, solo para sincronizar modelos con la base de datos
    // descomentar esto en fase definitiva para evitar perder datos, y comentar el sync de arriba
    // if (env.nodeEnv !== 'production') {
    //   await sequelize.sync({ force: false });
    // }
    console.log('Models synced');
    await runSeed();
    app.listen(PORT, () => {
      console.log(`API listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
};

startServer();

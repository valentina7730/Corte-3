console.log("Mi primera app en express.js");
require('dotenv').config();
const express = require('express');
const { corsMiddleware } = require('./shared/middleware/cors');
const { testConnection } = require('./config/database');
const { syncModels } = require('./shared/models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(corsMiddleware);

// Inicializar base de datos
const initializeDatabase = async () => {
  await testConnection();
  await syncModels();
};

app.get('/', (req, res) => {
  console.log(`Sistema de login funcionando correctamente en el puerto ${PORT}`);
  res.json({
    message: '¡Hola! Express funcionando con MySQL',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Login
app.use('/', require('./routes/auth'));


// Inicializar servidor
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

startServer();

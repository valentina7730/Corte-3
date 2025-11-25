const { sequelize } = require('../../config/database');
const User = require('../models/User');

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); 
    console.log('Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
  }
};

module.exports = {
  User,
  syncModels
};

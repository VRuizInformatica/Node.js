const { Sequelize } = require('sequelize');

const db = new Sequelize('TutorialNode', 'root', '1234', {
host: 'localhost',
dialect: 'mysql',
  logging: false,
});

db.authenticate()
.then(() => console.log('Conexión a la base de datos exitosa.'))
.catch((err) => console.error('No se pudo conectar a la base de datos:', err));

module.exports = db;

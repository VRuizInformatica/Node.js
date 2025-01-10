const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const Nota = db.define('nota', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false
});

(async () => {
    await db.sync();
})();

module.exports = Nota;

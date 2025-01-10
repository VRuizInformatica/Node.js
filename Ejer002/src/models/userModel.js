import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

module.exports = Users;

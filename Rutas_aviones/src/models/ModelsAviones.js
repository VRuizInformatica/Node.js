const db = require('../config/Database');

module.exports = {
    // CRUD de ciudades
    getAllCiudades: (callback) => {
        db.query('SELECT * FROM Ciudad', (err, results) => {
            callback(err, results);
        });
    },
    getAllCiudadesAsync: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM Ciudad', (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    createCiudad: (nombre, poblacion, km2, callback) => { /* ... */ },
    updateCiudad: (id, nombre, poblacion, km2, callback) => { /* ... */ },
    deleteCiudad: (id, callback) => { /* ... */ },

    // CRUD de enlaces
    getAllEnlaces: (callback) => {
        db.query('SELECT * FROM Enlace', (err, results) => {
            callback(err, results);
        });
    },
    getAllEnlacesForRuta: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM Enlace', (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    createEnlace: (idOrigen, idDestino, tiempo, callback) => {
        // Insert con SOLO tiempo
        const sql = 'INSERT INTO Enlace (idOrigen, idDestino, tiempo) VALUES (?,?,?)';
        db.query(sql, [idOrigen, idDestino, tiempo], (err, results) => {
            callback(err, results);
        });
    },
    updateEnlace: (idOrigen, idDestino, tiempo, callback) => {
        const sql = 'UPDATE Enlace SET tiempo=? WHERE idOrigen=? AND idDestino=?';
        db.query(sql, [tiempo, idOrigen, idDestino], (err, results) => {
            callback(err, results);
        });
    },
    deleteEnlace: (idOrigen, idDestino, callback) => {
        const sql = 'DELETE FROM Enlace WHERE idOrigen=? AND idDestino=?';
        db.query(sql, [idOrigen, idDestino], (err, results) => {
            callback(err, results);
        });
    },
};

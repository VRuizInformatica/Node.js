const express = require('express');
const router = express.Router();
const controller = require('../controllers/ControllerAviones');

// --- CIUDADES ---

// Obtener todas las ciudades http://localhost:3000/ciudades
router.get('/ciudades', controller.getAllCiudades);

// Crear una nueva ciudad http://localhost:3000/ciudades
router.post('/ciudades', controller.createCiudad);

// Actualizar una ciudad existente http://localhost:3000/ciudades/7
router.put('/ciudades/:id', controller.updateCiudad);

// Eliminar una ciudad http://localhost:3000/ciudades/7
router.delete('/ciudades/:id', controller.deleteCiudad);

// --- ENLACES ---

// Obtener todos los enlaces http://localhost:3000/enlaces
router.get('/enlaces', controller.getAllEnlaces);

// Crear un nuevo enlace http://localhost:3000/enlaces
router.post('/enlaces', controller.createEnlace);

// Actualizar un enlace existente http://localhost:3000/enlaces/1/7   1 con idOrigen y 7 con idDestino
router.put('/enlaces/:idOrigen/:idDestino', controller.updateEnlace);

// Eliminar un enlace http://localhost:3000/enlaces/1/7  1 con idOrigen y 7 con idDestino
router.delete('/enlaces/:idOrigen/:idDestino', controller.deleteEnlace);

// --- RUTA ---

// Calcular ruta  http://localhost:3000/ruta?origen=1&destino=3
router.get('/ruta', controller.getRuta);

module.exports = router;

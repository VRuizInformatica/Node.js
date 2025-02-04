const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Endpoint: POST /api/subscriptions → Crear una nueva suscripción
router.post('/', async (req, res) => {
    try {
        const { service_name, subscription_date, status } = req.body;

        if (!service_name) {
            return res.status(400).json({ message: 'El nombre del servicio es obligatorio' });
        }

        // Insertar la suscripción asociada al usuario autenticado
        await db.execute(
            'INSERT INTO subscriptions (user_id, service_name, subscription_date, status) VALUES (?, ?, ?, ?)',
            [req.user.id, service_name, subscription_date || new Date(), status || 'active']
        );

        res.status(201).json({ message: 'Suscripción creada exitosamente' });
    } catch (error) {
        console.error('Error al crear suscripción:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Endpoint: GET /api/subscriptions → Listar todas las suscripciones del usuario autenticado
router.get('/', async (req, res) => {
    try {
        const [subscriptions] = await db.execute(
            'SELECT * FROM subscriptions WHERE user_id = ?',
            [req.user.id]
        );

        res.json(subscriptions);
    } catch (error) {
        console.error('Error al obtener suscripciones:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Endpoint: PUT /api/subscriptions/:id → Modificar una suscripción existente
router.put('/:id', async (req, res) => {
    try {
        const { service_name, subscription_date, status } = req.body;
        const { id } = req.params;

        // Verificar que la suscripción exista y pertenezca al usuario autenticado
        const [result] = await db.execute(
            'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        if (result.length === 0) {
            return res.status(404).json({ message: 'Suscripción no encontrada' });
        }

        // Actualizar la suscripción (solo se actualizan los campos enviados)
        await db.execute(
            'UPDATE subscriptions SET service_name = COALESCE(?, service_name), subscription_date = COALESCE(?, subscription_date), status = COALESCE(?, status) WHERE id = ?',
            [service_name, subscription_date, status, id]
        );

        res.json({ message: 'Suscripción actualizada' });
    } catch (error) {
        console.error('Error al actualizar suscripción:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Endpoint: DELETE /api/subscriptions/:id → Eliminar una suscripción
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la suscripción exista y pertenezca al usuario autenticado
        const [result] = await db.execute(
            'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        if (result.length === 0) {
            return res.status(404).json({ message: 'Suscripción no encontrada' });
        }

        await db.execute(
            'DELETE FROM subscriptions WHERE id = ?',
            [id]
        );

        res.json({ message: 'Suscripción eliminada' });
    } catch (error) {
        console.error('Error al eliminar suscripción:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;

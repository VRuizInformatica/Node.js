// index.js
const express = require('express');
require('dotenv').config();

const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas de suscripciones (protegidas)
const subscriptionRoutes = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Suscripciones en Node.js');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

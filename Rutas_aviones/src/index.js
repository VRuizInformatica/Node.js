const express = require('express');
const app = express();
const routes = require('./routes/routes');

// Middleware para parsear JSON
app.use(express.json());

// Montamos las rutas
app.use('/', routes);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

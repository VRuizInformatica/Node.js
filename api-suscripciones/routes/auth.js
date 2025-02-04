const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Endpoint: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validar campos
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya existe
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario
        await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Endpoint: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Buscar el usuario
        const [userResult] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (userResult.length === 0) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const user = userResult[0];

        // Comparar la contraseña
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Crear y enviar el JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '3m' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;

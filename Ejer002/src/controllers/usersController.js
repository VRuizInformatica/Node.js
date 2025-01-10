const Users = require('../models/userModel');
const bcrypt = require('bcrypt');

const GetUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'password']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

const Register = async (req, res) => {
    const { username, password, confPassword } = req.body;
    if (password !== confPassword)
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });

    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        await Users.create({
            name: username,
            password: hashPassword
        });
        res.json({ msg: "Registration Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

module.exports = { GetUsers, Register };

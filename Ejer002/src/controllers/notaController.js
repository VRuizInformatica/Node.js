const Nota = require('../models/notaModel');

const getNotes = async (req, res) => {
    try {
        const notas = await Nota.findAll();
        res.json(notas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener notas' });
    }
};

const addNote = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const nota = await Nota.create({ titulo, descripcion });
        return res.status(201).json(nota);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear la nota' });
    }
};

const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;

        const nota = await Nota.findByPk(id);
        if (!nota) return res.status(404).json({ message: 'Nota no encontrada' });

        nota.titulo = titulo;
        nota.descripcion = descripcion;
        await nota.save();

        res.json(nota);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar la nota' });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const nota = await Nota.findByPk(id);
        if (!nota) return res.status(404).json({ message: 'Nota no encontrada' });

        await nota.destroy();
        res.json({ message: 'Nota eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar la nota' });
    }
};

module.exports = {
    getNotes,
    addNote,
    updateNote,
    deleteNote
};

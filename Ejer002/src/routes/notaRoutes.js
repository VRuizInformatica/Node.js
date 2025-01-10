const { Router } = require('express');
const { getNotes, addNote, updateNote, deleteNote } = require('../controllers/notaController');

const router = Router();

// GET /api/notes
router.get('/', getNotes);

// POST /api/notes
router.post('/', addNote);

// PUT /api/notes/:id
router.put('/:id', updateNote);

// DELETE /api/notes/:id
router.delete('/:id', deleteNote);

module.exports = router;

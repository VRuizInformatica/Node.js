const { Router } = require('express');
const router = Router();

//Raíz del API
router.get('/', (req, res) => {
    res.json({
        "Title": "Hola mundo usando rutas!"
    });
});

module.exports = router;

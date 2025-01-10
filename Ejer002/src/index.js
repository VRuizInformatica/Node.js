const express = require('express');
const morgan = require('morgan');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
res.json({ "Title": "Hola mundo desde la ruta raíz" });
});

app.use('/', require('./routes/index'));  

app.use('/api/notes', require('./routes/notaRoutes'));

app.listen(app.get('port'), () => {
console.log(`Server listening on port ${app.get('port')}`);
});

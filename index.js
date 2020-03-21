const express = require('express');
const conectarDB = require('./config/db');

//Creamos el servidor
const app = express();

//Nos conectamo a la base de datos
conectarDB();

//Puerto para la app
const PORT = process.env.PORT || 4000;

/*
//Definimos la pagina principal (probamos que el servidor funciona, y que no informe 'Cannot GET /')
app.get('/', (req, res) => {
    res.send('Hola Checho Loco');
})
*/

//Arrancamos la app
app.listen(PORT, () => {
    console.log(`El servidor esta arrancando en el puerto ${PORT}`);
})



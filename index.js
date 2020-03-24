const express = require('express');
const conectarDB = require('./config/db');

//Creamos el servidor
const app = express();

//Nos conectamo a la base de datos
conectarDB();

//Habilitamos express.json para leer datos desde el usuario (en alternativa a bodyParser)
//entonces hay que mandar/completar el 'Headers' como Key=Content-Type y Value=application/json
//y el 'Body' como Raw con el JSON que pongamos de ejemplo en POSTMAN
app.use(express.json({ extended: true }));

//Puerto para la app
const PORT = process.env.PORT || 4000;

//Importamos las rutas...ponemos /api para que sea extendible y por si despues queremos hacer el proyecto web desde el /
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));

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



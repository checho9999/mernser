//Rutas para el CRUD de los proyectos
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Creamos un proyecto
// hacia api/proyectos
router.post('/',
    auth, //primero verifica el middleware auth, y pasa al siguiente con el next del middleware auth
    [
        check('nombre', 'El nombre del proyecto es obligatoio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

//Obtenemos todos los proyectos
router.get('/', 
    auth,
    proyectoController.obtenerProyectos
)

//Actualizamos el nombre del proyecto via ID registrado
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del Proyecto es obligatoio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminamos un Proyecto existente via ID registrado
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;
//Rutas para el CRUD de las tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Creamos una tarea
// hacia api/tareas
router.post('/',
    auth, //primero verifica el middleware auth, y pasa al siguiente con el next del middleware auth
    [
        check('nombre', 'El Nombre de la Tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El ID Proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Obtenemos todas las tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//Actualizamos la tarea via ID registrado
router.put('/:id', 
    auth,
    tareaController.actualizarTarea
);

//Eliminamos una tarea existente via ID registrado
router.delete('/:id', 
    auth,
    tareaController.eliminarTarea
);

module.exports = router;
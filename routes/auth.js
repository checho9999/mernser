//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Creamos un usuario(iniciar sesion)
// hacia api/auth
router.post('/', 
    //Quitamos esta validacion porque ahora la hacemos desde el frontend
    /*[
        //Agregamos reglas de validacion con express-validator antes de llamar al controlador
        check('email', 'Ingresa un Email válido').isEmail(),
        check('password', 'El Password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],*/
    authController.autenticarUsuario
);

//Obtenemos el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;
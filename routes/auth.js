//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

//Creamos un usuario
// hacia api/auth
router.post('/', 
    [
        //Agregamos reglas de validacion con express-validator antes de llamar al controlador
        check('email', 'Ingresa un mail válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

module.exports = router;
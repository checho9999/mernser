//Rutas para la creacion de usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

//Creamos un usuario
//...api/usuarios
router.post('/', 
    [
        //Agregamos reglas de validacion con express-validator antes de llamar al controlador
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Ingresa un mail válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    //console.log('Creando Usuario');
    usuarioController.crearUsuario
);

module.exports = router;
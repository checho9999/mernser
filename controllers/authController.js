//importamos el modelo
const Usuario = require('../models/Usuario')
//importamos el hasheador
const bcryptjs = require('bcryptjs');
//importamos el resultado de la validacion desde usuarios
const { validationResult } = require('express-validator');
//importamos JSON Web Token
const jwt = require('jsonwebtoken');

//enviamos la peticion
exports.autenticarUsuario = async (req, res) => {

    //Revisamos si hubo errores en los check agregados en auth
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraemos los datos del usuario desde el body
    const { email, password } = req.body;

    try {
        //Revisamos que el email este registrado
        let usuario = await Usuario.findOne({ email });
        // Si el email no estaba registrado
        if (!usuario){
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //Revisamos que el password ingresado coincida con el registrado
        let passCorrecto = await bcryptjs.compare(password, usuario.password);
        // Si el password no estaba registrado
        if (!passCorrecto){
            return res.status(400).json({ msg: 'Password incorrecto' });
        }

        //Si el login fue correcto
        //Crear y firmar el JSON Web Token
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmamos el JSW
        jwt.sign(payload, process.env.SECRETA, {            
            expiresIn: 360 //La duracion del token es en segundos
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({ token }); 
        });

    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo en error');
    }   

}

//Obtenemos que usuario esta autenticado
exports.usuarioAutenticado = async ( req, res ) => {

    try {

        //Obtenemos los datos desde el usuario ignorando solo su password
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});

    } catch (error) {

        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }

}
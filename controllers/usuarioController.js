//importamos el modelo
const Usuario = require('../models/Usuario')
//importamos el hasheador
const bcryptjs = require('bcryptjs');
//importamos el resultado de la validacion desde usuarios
const { validationResult } = require('express-validator');
//importamos JSON Web Token
const jwt = require('jsonwebtoken');

//enviamos la peticion
exports.crearUsuario = async (req, res) => {
    //console.log(req.body);

    //Revisamos si hubo errores en los check agregados en usuarios
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraemos los datos del usuario desde el body
    const { email, password } = req.body;

    try {
        //Revisamos que el email registrado no este repetido, ya que esta declarado como unique
        let usuario = await Usuario.findOne({email});
        // Si el email ya estaba registrado
        if (usuario){
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //crea la instancia al nuevo usuario
        usuario = new Usuario(req.body);
        
        //Hashear el password con un salt para que sea unico (por si el usuario pone un password comun)
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardamos el nuevo usuario
        await usuario.save();

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

        //Mensaje de confirmacion
        //res.send('Usuario creado correctamente');
        //res.json({ msg: 'Usuario creado correctamente' });

    } catch(error) {
        console.log(error);
        res.status(400).send('Hubo en error');
    }  
}
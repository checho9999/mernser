const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    //Leemos el token desde el Headers
    const token = req.header('x-auth-token');
    //console.log(token);

    //Revisamos si existe el token
    if (!token) {
        return res.status(401).json({ msg: 'No hay Token, permiso no válido' })
    }

    //Validamos el token
    try {

        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); //con next vamos al siguiente middleware => proyectoController.xxx

    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }

}
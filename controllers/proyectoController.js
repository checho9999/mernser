//importamos el modelo
const Proyecto = require('../models/Proyecto')
//importamos el resultado de la validacion desde usuarios
const { validationResult } = require('express-validator');

//enviamos la peticion
exports.crearProyecto = async (req, res) => {

    //Revisamos si hubo errores en los check agregados en proyectos
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    try {
        ////Creacion del nuevo proyecto////
        //crea la instancia al nuevo proyecto
        proyecto = new Proyecto(req.body); 

        //Guardamos al creador via JWT
        proyecto.creador = req.usuario.id; 
        
        //guardamos el nuevo proyecto
        await proyecto.save();
        res.json(proyecto);  
         
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo en error');        
    }

}

//Obtenemos todos los proyectos del usuario actualmente logeado
exports.obtenerProyectos = async (req, res) => {
    try {
        //console.log(req.usuario);
        //traemos todos los proyectos con find con sort: -1 para cambiar el orden
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualizamos el nombre de un proyecto registrado por su id
exports.actualizarProyecto = async (req, res) => {

    //console.log(req.params.id);
    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer la información del proyecto
    const { nombre } = req.body;
    //creamos esta variable para sobrescribir el proyecto existente
    const nuevoProyecto = {};
    
    //Si el nombre esta registrado
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {

        //revisamos que exista el ID 
        let proyecto = await Proyecto.findById(req.params.id);

        //Verificamos si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //verificamos que le creador del proyecto sea el mismo que lo quiere modificar
        if (proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //actualizamos el nombre del proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevoProyecto }, { new: true });

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Eliminamos un proyecto existente por su id 
exports.eliminarProyecto = async (req, res ) => {
    try {
        //revisamos que exista el ID 
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto no estaba registrado
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //verificamos que le creador del proyecto sea el mismo que lo quiere eliminar
        if (proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Eliminamos rel Proyecto
        await Proyecto.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: 'Proyecto eliminado '})

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }    
}
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Creamos una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revisamos si hubo errores en los check agregados en tareas
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }  

    try {

        //Extraemos los datos del proyecto desde el body
        const { proyecto } = req.body;

        //Verificamos si el proyecto existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'} )
        }

        //Revisamos si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado'} );
        }

        ////Creacion de la nueva tarea////
        //crea la instancia a la nueva tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Obtenemos todas las tareas de un proyecto del usuario actualmente logeado
exports.obtenerTareas = async (req, res) => {

    try {
        //Extraemos los datos del proyecto desde el body
        const { proyecto } = req.body;

        //Verificamos si el proyecto existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //Revisamos si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //traemos todas las tareas de un proyecto con find con sort: -1 para cambiar el orden
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizamos la tarea de un proyecto de un usuario registrado por su id
exports.actualizarTarea = async (req, res ) => {

    try {
        //Extraemos los datos del proyecto y de la tarea desde el body
        const { proyecto, nombre, estado } = req.body;

        //Buscamos la tarea para ver si esta registrada
        let tarea = await Tarea.findById(req.params.id);

        //Si la tarea no esta registrada
        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Extraemos los datos del ID proyecto desde la base de datos
        const existeProyecto = await Proyecto.findById(proyecto);

        //verificamos que le creador del proyecto sea el mismo que lo quiere modificar
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //creamos esta variable para sobrescribir la tarea existente con los datos del body
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //actualizamos la tarea con el nuevo estado o el nuevo nombre o con ambos
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id }, nuevaTarea, { new: true } );

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Eliminamos la tarea de un proyecto de un usuario registrado por su id
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraemos los datos del proyecto desde el body
        const { proyecto  } = req.body;

        //Buscamos la tarea para ver si esta registrada
        let tarea = await Tarea.findById(req.params.id);

        //Si la tarea no esta registrada
        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Extraemos los datos del ID proyecto desde la base de datos
        const existeProyecto = await Proyecto.findById(proyecto);

        //verificamos que le creador del proyecto sea el mismo que quiere eliminar la tarea
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminamos la tarea registrada en el proyecto
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}
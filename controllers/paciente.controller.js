import Paciente from "../models/Paciente.js";


//Funcion para agregar un nuevo pacientes
const agregarPacientes = async( req, res ) => {

    const paciente = new Paciente( req.body );

    //Identificar el veterinario que lo agrego
    paciente.veterinario = req.veterinario._id;
    
    try {
        
        const pacienteAlmacenado = await paciente.save();
        res.json( pacienteAlmacenado );


    } catch (error) {
        console.log( error );
    }

}


//Obtener a los pacientes
const obtenerPacientes = async ( req, res ) => {

    //Mostrar Todos los pacientes
    const pacientes = await Paciente.find().where( 'veterinario' ).equals( req.veterinario );

    res.json( pacientes );

}

//Obtener un paciente
const obtenerPaciente = async ( req, res ) => {

    const { id } = req.params;
    //Obtenemos el id
    const paciente = await Paciente.findById( id );

    //Comprobamos que el paciente existe
    if( !paciente ) {
        return res.status( 404 ).json( { msg: 'Paciente no encontrado' } );
    }

    //Comprobamos que al veterinario pertenece a ese paciente
    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {

        return res.json( { msg: 'Acción no Valida' } );
    }

    res.json( paciente );
 
}


//Actualizar un paciente
const actualizarPaciente = async ( req, res ) => {

    const { id } = req.params;
    //Obtenemos el id
    const paciente = await Paciente.findById( id );

    //Comprobamos que el paciente existe
    if( !paciente ) {
        return res.status( 404 ).json( { msg: 'Paciente no encontrado' } );
    }

    //Comprobamos que al veterinario pertenece a ese paciente
    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {

        return res.json( { msg: 'Acción no Valida' } );
    }

    //Actualizamos al paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {

        const pacienteActualizado = await paciente.save();
        res.json( pacienteActualizado );
  
    } catch (error) {
        console.log( error );
    }

}


//Eliminar un paciente
const eliminarPaciente = async ( req, res ) => {

    const { id } = req.params;
    //Obtenemos el id
    const paciente = await Paciente.findById( id );

    //Comprobamos que el paciente existe
    if( !paciente ) {
        return res.status( 404 ).json( { msg: 'Paciente no encontrado' } );
    }

    //Comprobamos que al veterinario pertenece a ese paciente
    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {

        return res.json( { msg: 'Acción no Valida' } );
    }

    //Eliminando un paciente
    try {
        await paciente.deleteOne();
        res.json( { msg: 'Paciente eliminado' } );
    } catch (error) {
        console.log( error );
    }

}


export {
    agregarPacientes,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}
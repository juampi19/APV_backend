import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/registroEmail.js";
import reestablecerPassword from "../helpers/emailOlvidePassword.js";

//Registrar un veterinario
const registrar = async ( req, res ) => {
    //Extraemos el email del body parse para hacer las comprobaciones
    const { email, nombre  } = req.body;

    //Prevenir registros duplicados por el email
    const usuarioExiste = await Veterinario.findOne( { email } );
    
    //Si el usuario existe detenemos la ejecución y mandamos un mensaje
    if( usuarioExiste ) {
        const error = new Error( 'Usuario ya registrado' );
        return res.status(400).json( { msg: error.message } );
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario( req.body );
        const veterinarioGuardado = await veterinario.save();

        //enviar el email
        emailRegistro( {
            email,
            nombre,
            token: veterinarioGuardado.token
        } );


        res.json( veterinarioGuardado );

    } catch (error) {
        console.log( error );
    }
       
}

//Mostrando el perfil
const perfil = ( req, res ) => {
    
    const { veterinario } = req;

    res.json( veterinario );
}

//Confirmando cuentas de usuarios
const confirmar = async ( req, res ) => {
    //leer información desde la url
    const { token } = req.params;

    //Buscamos al usuario con el token que buscamos
    const usuarioConfirmar = await Veterinario.findOne( { token } );

    //Si el token no es valido mandamos un mensaje de error y detenemos la ejecucion
    if( !usuarioConfirmar ) {
        const error = new Error( 'Token no válido' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    try {
        //borramos el token y confirmado cambia a true
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        //Guardamos el veterinario co los datos modificados
        await usuarioConfirmar.save();

        res.json( { msg: 'Usuario confirmado correctamente' } );
        
    } catch (error) {
        console.log( error );
    }

    
}

//Autenticar al usuario
const autenticar = async ( req, res ) => {

    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne( { email } );

    if( !usuario ) {
        const error = new Error( "El usuario no existe" );
        return res.status( 403 ).json( { msg: error.message } );
    }

    //Comprobar si el usuario esta confirmado
    if( !usuario.confirmado ) {
        const error = new Error( 'Tu Cuenta no ha sido confirmada' );
        return res.status( 403 ).json( { msg: error.message } );
    }

    //Revisar el password
    if( await usuario.comprobarPassword( password ) ) {
        //autenticando con JWT
        res.json( {
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT( usuario.id )
        });
        
    }else {
        const error = new Error( 'La contraseña es incorrecta' );
        return res.status( 403 ).json( { msg: error.message } );
    }
    
}

//cuando el usuario olvida su password
const olvidePassword = async ( req, res ) => {
    const { email } = req.body;

    //Verificamos si el veterinario existe
    const existeVeterinario = await Veterinario.findOne( { email } );

    //Cuando el ususario no existe
    if( !existeVeterinario ) {
        const error = new Error( 'El Usuario no existe' );
        return res.status( 400 ).json( { msg: error.message } );
    }

    //Generamos un token cuando el usuario existe
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Despues que se genera el nuevo token mandamos el email
        reestablecerPassword( {
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
            email
        } );

        res.json( { msg: 'Hemos enviado un email con las instrucciones' } );
    } catch (error) {
        console.log( error );
    }
}

const comprobarToken = async ( req, res ) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne( { token } );
    
    if( tokenValido ) {
        //El token es valido
        res.json( { msg: 'Token valido el ususario existe' } );
    }else {
        const error = new Error( 'Token no valido' );
        return res.status( 400 ).json( { msg: error.message } );
    }
}


const nuevoPassword = async ( req, res ) => {
    //Leemos el token
    const { token } = req.params;
    //Nuevo password
    const { password } = req.body;

    //Validamos el token
    const veterinario = await Veterinario.findOne( { token } );

    if( !veterinario ) {
        //Mostramos un mensaje cuando el token no es valido
        const error = new Error( 'Hubo un error' );
        return res.status( 400 ).json( { msg: error.message } );
    }

    try {
        veterinario.token = null;

        veterinario.password = password;

        await veterinario.save();
        res.json( { msg: 'Password modificado correctamente' } );
        
    } catch (error) {
        console.log( error );
    }
}

//Actualizar el perfil
const actualizarPerfil = async ( req, res ) => {
    const veterinario = await Veterinario.findById( req.params.id );

    if( !veterinario ) {
        const error = new Error( 'Hubo un error' );
        return res.status(400).json({msg: error.message});
    }
    
    const {email} = req.body;
    if( veterinario.email !== req.body.email ) {
        const existeEmail = await Veterinario.findOne( { email } );

        if( existeEmail ) {
            const error = new Error( 'Ese email ya esta en uso' );
            return res.status(400).json({msg: error.message});
        }
    } 

    try {
        
        //Creamos una instancia del veterinario
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json( veterinarioActualizado );

    } catch (error) {
        console.log( error );
    }
}

//cambiar Password
const actualizarPassword = async ( req, res ) => {
    //Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    //comprobar que le veterinario exista
    const veterinario = await Veterinario.findById( id );
    if( !veterinario ) {
        const error = new Error( 'Hubo un error' );
        return res.status( 400 ).json( { msg: error.message } );
    }
    //comprobar el password
    if( await veterinario.comprobarPassword( pwd_actual ) ){
        //Almacena el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json( { msg: 'Password Almacenado Correctamente' } );
    }else {
        const error = new Error( 'El Password actual es incorrecto' );
        return res.status( 400 ).json( { msg: error.message } );
    }
    

}


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}
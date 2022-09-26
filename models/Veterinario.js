import mongoose from "mongoose";
import bcrypt from 'bcrypt'; 
import generarId from "../helpers/generarId.js";


//Creando el modelo de veterinario
const veterinarioSchema = mongoose.Schema( {
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false,
    }
} );

//antes de almacenar el registro hasheamoss las password
veterinarioSchema.pre( 'save', async function( next ) {

    //Prevenir que vuelva a hashear
    if( !this.isModified( 'password' ) ) {
        next();
    }
    //rondas de hasheo
    const salt = await bcrypt.genSalt( 10 );
    //hasheando el password
    this.password = await bcrypt.hash( this.password, salt );
} );

//Comprobar las password hasheadas
veterinarioSchema.methods.comprobarPassword = async function( passwordFormulario ) {
    return await bcrypt.compare( passwordFormulario, this.password );
}

//Registrando el schema en mongose
const Veterinario = mongoose.model( 'Veterinario', veterinarioSchema );

export default Veterinario;
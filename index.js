import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinario.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';

//mandar a llamar express y tener toda la funcionalidad para crear el servidor
const app = express();

//Habilitar bodyParse para leer los datos enviados a node
app.use( express.json() );

//Para leer las variables de entorno
dotenv.config();

//Llamando a la base de datos
conectarDB();

//Habilitando los cors
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function( origin, callback ) {
        if( dominiosPermitidos.indexOf( origin ) !== -1 ) {
            //El origen del request es permitido
            callback( null, true );
        }else {
            callback( new Error( 'No permitido por CORS' ) );
        }
    }
}

app.use( cors( corsOptions ) );

app.use( '/api/veterinarios', veterinarioRoutes );
app.use( '/api/pacientes', pacienteRoutes );

const PORT = process.env.PORT || 4000;

//Arrancar el servidor
app.listen( PORT, () => {
    console.log( `Servidor funcionando el el port ${PORT}` );
} );
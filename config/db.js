//Configuración para conectarse a la base de datos
import mongoose from "mongoose";

//Conectar a la base de datos
const conectarDB = async() => {
    try {
        //conectandose a mongoDB
        const db = await mongoose.connect( process.env.MONGO_URI );

        const url = `${db.connection.host}:${db.connection.port}`;
        
        console.log( `MongoDB Conectado en: ${url}` );

    } catch (error) {
        console.log( `error: ${error.message}` );
        process.exit(1);
    }
}


export default conectarDB;
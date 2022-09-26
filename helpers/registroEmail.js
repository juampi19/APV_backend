import nodemailer from 'nodemailer';

const emailRegistro = async( data ) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Enviarl Email;
    const { email, nombre, token } = data;

    const informacion = await transporter.sendMail( {
      from: "APV - Administrador de Pacientes de Veterinaria",
      to: email,
      subject: "Comprueba tu cuenta en APV",
      text: "Comprueba tu cuenta en APV",
      html:`<p>Hola: ${ nombre }, comprueba tu cuenta en APV</p>
            <P>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
            <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>Comprobar Cuenta</a>
            </P>
            <p>Si no creaste esta cuenta puedes eliminar este mensaje</p>
      `
    } );

    console.log( 'Mensaje enviado: %s', informacion.messageId );
}


export default emailRegistro;
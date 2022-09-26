import nodemailer from 'nodemailer';

const reestablecerPassword = async( data ) => {

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
      subject: "Reestablece tu Password",
      text: "Reestablece tu Password",
      html:`<p>Hola: ${ nombre }, has solicitado reestablecer tu password.</p>
            <P>Sigue el siguiente enlace para generar un nuevo password:
            <a href='${process.env.FRONTEND_URL}/olvide-password/${token}'>Reestablecer password</a>
            </P>
            <p>Si no creaste esta cuenta puedes eliminar este mensaje</p>
      `
    } );

    console.log( 'Mensaje enviado: %s', informacion.messageId );
}


export default reestablecerPassword;
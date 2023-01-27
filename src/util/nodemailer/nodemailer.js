import { createTransport } from 'nodemailer';

const TEST_MAIL = "florine.hessel54@ethereal.email";

const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: 'Vc2U3c5kuqKmxFq7cB'
    }
});

const transporterGmail = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS
    }
 });

async function sendNewUserMail(newUser) {
    try {
        const html = 
        `
            <h1>Se detecto un nuevo registro!</h1>
            <p>
                Email: ${newUser.username}
                Nombre completo: ${newUser.name}
                Direccion: ${newUser.address}
                Telefono: ${newUser.phone}
            </p>
        `

        const mailOptions = {
            from: 'Ghibli Store',
            to: process.env.GMAIL_ADDRESS,
            subject: 'Nuevo registro',
            html
        }

        const info = await transporterGmail.sendMail(mailOptions)
        console.log(info)
    }
    catch (error) {
        console.log(error)
    }
}

async function sendNewOrder(message) {
    try {
        const html = message;

        const mailOptions = {
            from: 'Ghibli Store',
            to: process.env.GMAIL_ADDRESS,
            subject: 'Nueva orden en la tienda',
            html
        }

        const info = await transporterGmail.sendMail(mailOptions)
        console.log(info)
    }
    catch (error) {
        console.log(error)
    }
}
export default { sendNewUserMail, sendNewOrder };
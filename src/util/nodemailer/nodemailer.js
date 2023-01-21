import { createTransport } from 'nodemailer';

const TEST_MAIL = "florine.hessel54@ethereal.email"

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
        user: 'racagnisasha@gmail.com',
        pass: process.env.GMAIL_PASS
    }
 });
 

const mailOptions = {
    from: 'Ghibli Store',
    to: TEST_MAIL,
    subject: 'Mail de prueba',
    html: '<h1>Contenido de prueba</h1>'
}

async function sendMail() {
    try {
        const info = await transporterGmail.sendMail(mailOptions)
        console.log(info)
    }
    catch (error) {
        console.log(error)
    }
}

export default sendMail;
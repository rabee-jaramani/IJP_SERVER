const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
// const path = require('path');
const cors = require("cors");


const app = express();
// const router = express.Router();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://apparelglobal.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Configure storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: 'eu-smtp-outbound-1.mimecast.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'ijp@apparelglobal.com', // Your email
        pass: '64Ld!*52zXAtpVYt&XT$XOEsa', // Your email password
    },
});

// API endpoint to send email with attachment
app.post('/send-email', upload.single('attachment'), (req, res, next) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'ijp@apparelglobal.com', // Your email
        to: to,
        subject: subject,
        text: text,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.send('error X', error)
        } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');
        }
    });
});
transporter.verify((err, success) => {
    if (err) console.error(err);
    console.log('Your config is correct');
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/rabee', (req, res) => {
    res.send('HELOO RABEE');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
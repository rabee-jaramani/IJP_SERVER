const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
// const path = require('path');
const cors = require("cors");


const app = express();
// const router = express.Router();
const PORT = process.env.PORT || 5000;
app.use(cors());
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
        pass: '', // Your email password
    },
});

// API endpoint to send email with attachment
app.post('/send-email', upload.single('attachment'), (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'ijp@apparelglobal.com', // Your email
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: req.file.originalname,
                content: req.file.buffer,
            },
        ],
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
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
app.get('/about', (req, res) => {
    res.send('about');
});
app.get('/asd', (req, res) => {
    res.send('Heloo `AS`d');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

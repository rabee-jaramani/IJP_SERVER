const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require("cors");


const app = express();
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
        pass: '64Ld!*52zXAtpVYt&XT$XOEsa', // Your email password
    },
});

// API endpoint to send email with attachment
app.post('/send-email', upload.single('attachment'), (req, res) => {
    try {
        const { to, subject, text } = req.body;

        var mailOptions = {
            from: 'ijp@apparelglobal.com', // Your email
            to: to,
            subject: subject,
            text: text,
            attachments: req.file
                ? [{ filename: req.file.originalname, content: req.file.buffer }]
                : [],
        };
    } catch (error) {
        res.send("Error from post request", error)
    }
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
    if (success) console.log('Your config is correct');
});

app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.get('/hi', (req, res) => {
    res.send('hi thereX');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
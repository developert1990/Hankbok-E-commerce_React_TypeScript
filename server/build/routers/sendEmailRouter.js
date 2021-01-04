"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = __importDefault(require("express"));
const emailRouter = express_1.default.Router();
emailRouter.post('/', (req, res) => {
    console.log("이메일 라우터 들어옴");
    console.log('req.body', req.body);
    const message = `Name: ${req.body.name} ,\n${req.body.message}`;
    // Step 1
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
    // Step 2
    const mailOptions = {
        from: req.body.email,
        to: 'sangmean.test@gmail.com',
        subject: `From - ${req.body.email}`,
        text: message
    };
    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            res.send({ msg: 'There is an error to Send Message', success: false, loading: false });
        }
        else {
            res.send({ msg: 'Your Message sent successfully', success: true, loading: false });
            console.log("Email sent");
        }
    });
});
exports.default = emailRouter;

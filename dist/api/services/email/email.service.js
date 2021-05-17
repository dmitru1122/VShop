"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const TARGET_EMAIL_ADDRESS = process.env.CONTACTUS_RECIPIENTS;
const EMAIL_SERV_USER = process.env.SSMTP_USER;
const EMAIL_SERV_PASS = process.env.SSMTP_PASS;
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_SERV_USER,
                pass: EMAIL_SERV_PASS,
            },
        });
    }
    sendEmail(data) {
        return new Promise((resolve, reject) => {
            const { subject, html } = data;
            this.mail = {
                to: TARGET_EMAIL_ADDRESS,
                subject,
                html,
            };
            this.transporter.sendMail(this.mail, (err, info) => {
                if (err) {
                    console.log('Send Email ERROR: ');
                    console.log(err);
                    return reject(err);
                }
                console.log('Email sent: ', info.response);
                resolve(info.response);
            });
        });
    }
}
exports.EmailService = EmailService;
exports.default = new EmailService();

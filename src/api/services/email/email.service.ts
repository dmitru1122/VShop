import Nodemailer from 'nodemailer';

const TARGET_EMAIL_ADDRESS = process.env.CONTACTUS_RECIPIENTS;
const EMAIL_SERV_USER = process.env.SSMTP_USER;
const EMAIL_SERV_PASS = process.env.SSMTP_PASS;

export class EmailService {
  private transporter: Nodemailer.Transporter;
  private mail: Nodemailer.SendMailOptions;

  constructor() {
    this.transporter = Nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_SERV_USER,
        pass: EMAIL_SERV_PASS,
      },
    });
  }

  public sendEmail(data: { subject: string; html: string }): Promise<any> {
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

export default new EmailService();

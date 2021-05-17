import { Request, Response } from 'express';

import EmailService from '../../services/email/email.service';

export class EmailController {
  public async sendEmail(req: Request, res: Response): Promise<void> {
    console.log('======================');
    console.log('Sending Email requested');
    console.log('======================');

    const { html, subject } = req.body;

    try {
      const email = await EmailService.sendEmail({ html, subject });

      res.status(200).json({ message: email });
    } catch (error) {
      console.log('EmailController sendEmail ERROR: ');
      console.log(error);
      res.status(404).json(error);
    }
  }
}

export default new EmailController();

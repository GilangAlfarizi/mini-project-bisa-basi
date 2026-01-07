import { IMailService } from '@application/services';
import { SendEmailRequest } from '@domain/mail';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(req: SendEmailRequest): Promise<void> {
    try {
      const smtpOptions: ISendMailOptions = req;
      await this.mailerService.sendMail(smtpOptions);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}

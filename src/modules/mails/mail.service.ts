import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  /**
   * Send a welcome email to a new user
   * @param {string} to - Recipient email address
   * @returns {Promise<{ success: boolean; error?: any }>} - Result of the email sending operation
   */
  async sendWelcomeEmail(
    to: string,
  ): Promise<{ success: boolean; error?: any }> {
    this.logger.log(`entered in [${this.sendWelcomeEmail.name}] function`);

    const msg = {
      to,
      from: process.env.MAIL_SENDER,
      templateId: process.env.TEMPLATE_WELCOME_ID,
    };

    try {
      await sgMail.send(msg);

      return { success: true };
    } catch (error) {
      this.logger.error('Error during sending email', error);
      return { success: false, error };
    }
  }
}

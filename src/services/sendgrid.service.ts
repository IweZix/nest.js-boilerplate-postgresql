import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

/**
 * SendGridService handles sending emails using SendGrid
 */
@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);
  private readonly mailSender: string;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    const mailSender = process.env.MAIL_SENDER;
    

    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not defined');
    }

    if (!mailSender) {
      throw new Error('MAIL_SENDER is not defined');
    }

    this.mailSender = mailSender;

    sgMail.setApiKey(apiKey);
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

    const templateWelcomeId = process.env.TEMPLATE_WELCOME_ID;

    if (!templateWelcomeId) {
      throw new Error('TEMPLATE_WELCOME_ID is not defined');
    }

    const msg = {
      to,
      from: this.mailSender,
      templateId: templateWelcomeId,
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

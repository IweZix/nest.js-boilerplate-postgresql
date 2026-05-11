import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

/**
 * ResendService handles sending emails using Resend
 */
@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);

  private fromEmail: string = '';
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.RESEND_MAIL_SENDER || '';
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
      from: this.fromEmail,
      to: to,
      subject: 'Welcome to Our App',
      html: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
    };

    const templateId = process.env.RESEND_TEMPLATE_WELCOME_ID;

    if (!templateId) {
      this.logger.error('Welcome email template ID is not defined');
      return { success: false, error: 'Template ID not defined' };
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: to,
        subject: msg.subject,
        html: msg.html,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Error during sending email', error);
      return { success: false, error };
    }
  }
}

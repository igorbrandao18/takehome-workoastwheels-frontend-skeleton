import sgMail from '@sendgrid/mail';
import { IEmailService, EmailTemplate } from '../../application/interfaces/IEmailService';
import { Logger } from '../logging/Logger';
import { ValidationError } from '../../domain/errors/ValidationError';

export class SendgridEmailService implements IEmailService {
    constructor(
        apiKey: string,
        private readonly logger: Logger,
        private readonly fromEmail: string
    ) {
        sgMail.setApiKey(apiKey);
    }

    private async sendEmail(
        to: string,
        template: EmailTemplate
    ): Promise<void> {
        try {
            await sgMail.send({
                to,
                from: this.fromEmail,
                subject: template.subject,
                html: template.body,
                trackingSettings: {
                    clickTracking: { enable: true },
                    openTracking: { enable: true }
                }
            });

            this.logger.info('Email sent successfully', {
                to,
                subject: template.subject
            });
        } catch (error) {
            this.logger.error('Failed to send email', error);
            throw new ValidationError('Failed to send email');
        }
    }

    async sendReservationConfirmation(
        to: string,
        reservationId: string,
        template: EmailTemplate
    ): Promise<void> {
        await this.sendEmail(to, {
            subject: `${template.subject} - #${reservationId}`,
            body: template.body
        });
    }

    async sendReservationCancellation(
        to: string,
        reservationId: string,
        template: EmailTemplate
    ): Promise<void> {
        await this.sendEmail(to, {
            subject: `${template.subject} - #${reservationId}`,
            body: template.body
        });
    }

    async sendPaymentConfirmation(
        to: string,
        reservationId: string,
        amount: number,
        template: EmailTemplate
    ): Promise<void> {
        await this.sendEmail(to, {
            subject: `${template.subject} - #${reservationId}`,
            body: template.body.replace('{{amount}}', amount.toString())
        });
    }

    async sendRefundConfirmation(
        to: string,
        reservationId: string,
        amount: number,
        template: EmailTemplate
    ): Promise<void> {
        await this.sendEmail(to, {
            subject: `${template.subject} - #${reservationId}`,
            body: template.body.replace('{{amount}}', amount.toString())
        });
    }
} 
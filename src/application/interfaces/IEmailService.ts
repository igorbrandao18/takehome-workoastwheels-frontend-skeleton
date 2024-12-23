export interface EmailTemplate {
    subject: string;
    body: string;
}

export interface IEmailService {
    sendReservationConfirmation(
        to: string,
        reservationId: string,
        template: EmailTemplate
    ): Promise<void>;

    sendReservationCancellation(
        to: string,
        reservationId: string,
        template: EmailTemplate
    ): Promise<void>;

    sendPaymentConfirmation(
        to: string,
        reservationId: string,
        amount: number,
        template: EmailTemplate
    ): Promise<void>;

    sendRefundConfirmation(
        to: string,
        reservationId: string,
        amount: number,
        template: EmailTemplate
    ): Promise<void>;
} 
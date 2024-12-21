import { Money } from '../../domain/value-objects/Money';

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export interface IPaymentGateway {
    processPayment(
        userId: string,
        amount: Money,
        paymentMethodId: string
    ): Promise<PaymentResult>;

    refundPayment(
        transactionId: string,
        amount: Money
    ): Promise<PaymentResult>;

    getPaymentStatus(transactionId: string): Promise<string>;
} 
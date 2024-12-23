import Stripe from 'stripe';
import { IPaymentGateway, PaymentResult } from '../../application/interfaces/IPaymentGateway';
import { Money } from '../../domain/value-objects/Money';
import { Logger } from '../logging/Logger';
import { ValidationError } from '../../domain/errors/ValidationError';

export class StripePaymentGateway implements IPaymentGateway {
    private stripe: Stripe;
    private logger: Logger;

    constructor(apiKey: string, logger: Logger) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16'
        });
        this.logger = logger;
    }

    async processPayment(
        userId: string,
        amount: Money,
        paymentMethodId: string
    ): Promise<PaymentResult> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount.toCents(),
                currency: amount.currency.toLowerCase(),
                payment_method: paymentMethodId,
                confirm: true,
                customer: userId,
                metadata: {
                    userId
                }
            });

            this.logger.info('Payment processed successfully', {
                userId,
                amount: amount.toString(),
                paymentIntentId: paymentIntent.id
            });

            return {
                success: true,
                transactionId: paymentIntent.id
            };
        } catch (error) {
            this.logger.error('Payment processing failed', error);
            return {
                success: false,
                error: this.handleStripeError(error)
            };
        }
    }

    async refundPayment(
        transactionId: string,
        amount: Money
    ): Promise<PaymentResult> {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: transactionId,
                amount: amount.toCents()
            });

            this.logger.info('Payment refunded successfully', {
                transactionId,
                refundId: refund.id,
                amount: amount.toString()
            });

            return {
                success: true,
                transactionId: refund.id
            };
        } catch (error) {
            this.logger.error('Payment refund failed', error);
            return {
                success: false,
                error: this.handleStripeError(error)
            };
        }
    }

    async getPaymentStatus(transactionId: string): Promise<string> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(
                transactionId
            );

            return paymentIntent.status;
        } catch (error) {
            this.logger.error('Failed to get payment status', error);
            throw new ValidationError('Failed to get payment status');
        }
    }

    private handleStripeError(error: any): string {
        if (error.type === 'StripeCardError') {
            return `Card error: ${error.message}`;
        }
        if (error.type === 'StripeInvalidRequestError') {
            return 'Invalid payment request';
        }
        return 'Payment processing failed';
    }
} 
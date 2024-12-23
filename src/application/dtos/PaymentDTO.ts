export interface ProcessPaymentDTO {
    userId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
    description: string;
}

export interface PaymentResponseDTO {
    success: boolean;
    transactionId?: string;
    error?: string;
    amount: {
        amount: number;
        currency: string;
    };
    status: string;
    processedAt: Date;
}

export interface RefundDTO {
    transactionId: string;
    amount: number;
    currency: string;
    reason: string;
} 
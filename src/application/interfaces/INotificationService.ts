export interface INotificationService {
    sendPushNotification(
        userId: string,
        notification: {
            title: string;
            body: string;
        }
    ): Promise<void>;

    sendSMS(
        phoneNumber: string,
        message: string
    ): Promise<void>;

    subscribeToTopic(
        userId: string,
        topic: string
    ): Promise<void>;

    unsubscribeFromTopic(
        userId: string,
        topic: string
    ): Promise<void>;
} 
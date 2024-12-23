import { DomainEvent } from './DomainEvent';

type EventHandler = (event: DomainEvent) => Promise<void>;

export class DomainEventPublisher {
    private static handlers: Map<string, EventHandler[]> = new Map();

    static subscribe(eventType: string, handler: EventHandler): void {
        const handlers = this.handlers.get(eventType) || [];
        handlers.push(handler);
        this.handlers.set(eventType, handlers);
    }

    static async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.eventType) || [];
        
        await Promise.all(
            handlers.map(handler => handler(event))
        );
    }

    static clearHandlers(): void {
        this.handlers.clear();
    }
} 
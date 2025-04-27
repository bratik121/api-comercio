import { Inject } from '@nestjs/common';
import { DomainEvent } from 'src/common/domain/domain-event';
import { Channel } from 'amqplib';
import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';

export class RabbitMQEventPublisher extends IEventPublisher {
  private readonly exchangeName = 'logs';

  constructor(
    @Inject('RABBITMQ_CONNECTION') private readonly channel: Channel,
  ) {
    super();
    this.initializeExchange();
  }

  private async initializeExchange() {
    // Cambiamos de 'fanout' a 'direct' para enrutar por clave
    await this.channel.assertExchange(this.exchangeName, 'direct', {
      durable: false,
    });
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const routingKey = event.constructor.name;
      this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(event.serialize()),
      );
    }
  }

  async subscribe<T extends DomainEvent>(
    eventName: string,
    handlers: IEventSubscriber<DomainEvent>[],
    mapper: (json: Record<any, any>) => T,
  ): Promise<void> {
    const queue = await this.channel.assertQueue('', { exclusive: true });
    super.subscribe(eventName, handlers, mapper);

    // Enlazamos específicamente al evento con la routingKey correspondiente
    await this.channel.bindQueue(queue.queue, this.exchangeName, eventName);
    this.channel.consume(
      queue.queue,
      (msg) => {
        if (msg !== null) {
          const event = mapper(JSON.parse(msg.content.toString()));
          const handlers = this.subscribers.get(eventName);
          if (handlers) {
            handlers.forEach((handler) => handler.on(event));
          }
        }
      },
      { noAck: true },
    );
  }
}

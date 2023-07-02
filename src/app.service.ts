import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService {
  kafka = new Kafka({
    clientId: 'nestjs-app1',
    brokers: [
      process.env.KAFKA_BROKER_1,
      process.env.KAFKA_BROKER_2,
      process.env.KAFKA_BROKER_3,
    ],
  });

  producer = this.kafka.producer();

  async getHello(): Promise<string> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: 'test-from-appX',
        messages: [{ value: 'hi from appX' }],
      });
      return 'Hello World!, send message success';
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }
}

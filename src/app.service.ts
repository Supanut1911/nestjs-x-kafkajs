import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { Kafka } from 'kafkajs';

interface ResultPayload {
  result: number;
}

@Injectable()
export class AppService {
  kafka = new Kafka({
    clientId: 'nestjs-appXXXXXXXXXX',
    brokers: [
      process.env.KAFKA_BROKER_1,
      process.env.KAFKA_BROKER_2,
      process.env.KAFKA_BROKER_3,
    ],
  });

  producer = this.kafka.producer();
  consumer = this.kafka.consumer({
    groupId: 'app-X-consumer-group',
  });

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

  async subSquare(x: number, y: number) {
    let resultPayload: ResultPayload;
    await this.producer.connect();
    await this.producer.send({
      topic: 'need-sub-from-appY',
      messages: [{ value: `{x:${x}, y:${y}}` }],
    });

    //************* subscribe / consume part *************
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'need-back-sub-result-to-appX',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });

        resultPayload = JSON.parse(message.value.toString());
      },
    });
    //****************************************************
    //deconstructure and assign
    console.log('yooooo result from app Y =>', resultPayload);

    const subResult = resultPayload.result;

    //process business logic
    const square = subResult * subResult;

    return {
      'subsquard result': square,
    };
  }
}

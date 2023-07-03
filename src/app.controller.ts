import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { log } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    console.log('KAFKA_BROKER_1', process.env.KAFKA_BROKER_1);
    console.log('KAFKA_BROKER_2', process.env.KAFKA_BROKER_2);
    console.log('KAFKA_BROKER_3', process.env.KAFKA_BROKER_3);

    return await this.appService.getHello();
  }

  @Post('sub-square')
  async subSquare(@Body('x') x: number, @Body('x') y: number) {
    return await this.appService.subSquare(x, y);
  }
}

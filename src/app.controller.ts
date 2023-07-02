import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    console.log('yo=>', process.env.TEST);

    return await this.appService.getHello();
  }

  @Post('sub-square')
  async subSquare(@Body('x') x: number, @Body('x') y: number) {
    return await this.appService.subSquare(x, y);
  }
}

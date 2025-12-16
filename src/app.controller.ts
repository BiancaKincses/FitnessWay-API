import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/products')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/users')
  getUsers(@Body() body: any): string {
    console.log("POST", body)
    return body;
  }

  @Get('/users')
  getUser(): string {
    return 'Get users'
  }
}

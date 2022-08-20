import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import { User as UserModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { AuthService } from './modules/auth/auth.service';

import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersService } from './modules/users/users.service';
import { SignupInput } from './inputs/signup.input';
import { Token } from './models/token.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('user')
  async signupUser(@Body() userData: SignupInput): Promise<Token> {
    return this.authService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req);
    return req.user;
  }
}

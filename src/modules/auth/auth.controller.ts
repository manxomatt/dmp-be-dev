import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, TokenDto } from './auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() authDto: AuthDto) {
    const login = await this.authService.login(authDto.email, authDto.password);
    const response = {
      success: true,
      login,
      // user,
    };
    return response;
  }

  @Post('refresh_token')
  refreshToken(@Body() tokenDto: TokenDto) {
    const token = this.authService.refreshToken(tokenDto.refreshToken);

    return token;
  }

  @Get('access_token')
  async accessToken(@Query('access_token') accessToken: string) {
    //@Args('access_token') accessToken: string){
    let response;
    const user = await this.authService.getUserFromToken(accessToken);
    if (user) {
      response = {
        success: true,
        token: {
          accessToken: accessToken,
        },
        user,
      };
    }

    return response;
  }
}

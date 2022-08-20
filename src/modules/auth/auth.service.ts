import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/services/prisma.service';
import { PasswordService } from 'src/services/password.service';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { SecurityConfig } from 'src/configs/config.interface';
import { Token } from 'src/models/token.model';
import { SignupInput } from 'src/inputs/signup.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          created_at: new Date(),
          updated_at: new Date(),
          password: hashedPassword,
        },
      });

      return this.generateTokens({
        userId: user.uuid,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async login(email: string, password: string) {
    const loginUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!loginUser) {
      throw new NotFoundException({
        message: `No user found for email: ${email}`,
        type: 'email',
      });
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      loginUser.password,
    );

    if (!passwordValid) {
      throw new BadRequestException({
        type: 'password',
        message: 'Invalid password',
      });
    }

    const token = this.generateTokens({
      userId: loginUser.uuid,
    });

    const response = {
      succcess: true,
      token,
    };
    const user = this.getUserFromToken(token.accessToken);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      //    user,
    };
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { uuid: userId } });
  }

  getUserFromToken(token: string) {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({
      select: {
        uuid: true,
        email: true,
        user_name: true,
      },
      where: { uuid: id },
    });
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

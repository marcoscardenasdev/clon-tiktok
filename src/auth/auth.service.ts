import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaService } from '../prisma.service';
import { JwtPayload } from "./interfaces/jwt.payload.interface";

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async singUp(registerUserDto: RegisterUserDto) {
    try {
      const { password, ...rest } = registerUserDto;
      const user = await this.prismaService.user.create({
        data: {
          ...rest,
          password: bcrypt.hashSync(password, 10),
        },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };

    } catch (error) {
      // console.log(error);
      this.handlerDBExceptions(error);
    }
  }

  async singIn(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return {
      token: this.getJwtToken({
        id: user.id,
        email: user.email,
      }),
    };
  }

  private handlerDBExceptions(error: any) {
    if (error.code === 'P2002') {
      throw new ConflictException(error.meta.driverAdapterError.cause.originalMessage);
    }
    
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, checks server logs');

  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}

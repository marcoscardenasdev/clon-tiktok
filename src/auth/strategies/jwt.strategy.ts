import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "../interfaces/jwt.payload.interface";
import { PrismaService } from "src/prisma.service";
import { envs } from "src/config";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        private readonly prismaService: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envs.jwtSecret,
        });
    }

    async validate(payload: JwtPayload ) {

        const { id, email } = payload;

        const user = await this.prismaService.user.findFirst({
            where: { id, email, },
        });

        if ( !user ) {
            throw new UnauthorizedException('Token not valid');
        }

        return user;
    }
}
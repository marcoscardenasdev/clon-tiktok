import { Module } from '@nestjs/common';

import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ UsersModule],
  controllers: [VideosController],
  providers: [VideosService, PrismaService],
  exports: [ VideosService ]
})
export class VideosModule {}

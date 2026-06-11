import { Module } from '@nestjs/common';

import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ AuthModule ],
  controllers: [VideosController],
  providers: [VideosService, PrismaService],
  exports: [ VideosService ]
})
export class VideosModule {}

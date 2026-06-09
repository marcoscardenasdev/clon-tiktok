import { Module } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaService } from '../prisma.service';
import { VideosModule } from '../videos/videos.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [VideosModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}

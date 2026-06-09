import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [VideosModule, UsersModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

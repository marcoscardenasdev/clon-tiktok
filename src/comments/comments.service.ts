import { Injectable } from '@nestjs/common';

import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from '../common/dto';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { VideosService } from '../videos/videos.service';

@Injectable()
export class CommentsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly videosService: VideosService,
  ) { }

  async create(
    videoId: number,
    createCommentDto: CreateCommentDto) {

    const { userId, ...rest } = createCommentDto;

    // Comprobar que el usuario como el video existan en la BD
    await this.usersService.findOne(userId);
    await this.videosService.findOne(videoId);

    // Si existen, guardamos el video en la BD
    const comment = await this.prismaService.comment.create({
      data: {
        userId,
        videoId,
        ...rest
      },
    });

    return comment;
  }

  async findAll(videoId: number, paginationDto: PaginationDto) {


    // Comprobar que el id del video existan en la BD
    await this.videosService.findOne(videoId);

    const { limit = 10, offset = 1} = paginationDto;

    const comments = await this.prismaService.comment.findMany({
      where: { videoId },
      take: limit,
      skip: ( offset - 1) * limit,
      include: {user: {
        select: {
          username: true,
        },
      }},
    });

    const total = await this.prismaService.comment.count({
      where: { videoId },
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: comments,
      meta: {
        limit, page: offset, total, lastPage,
      },
    };
  }
}

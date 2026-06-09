import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateVideoDto, UpdateVideoDto } from './dto';
import { PaginationDto } from '../common/dto';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class VideosService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createVideoDto: CreateVideoDto) {

    const { userId, ...rest} = createVideoDto;

    // Antes de guardar el video en la BD, comprobar que el usuario exista en la BD
    await this.usersService.findOne(userId);

    const video = await this.prismaService.video.create({
      data: {
        ...rest,
        userId,
      },
    });

    return video;
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1} = paginationDto;

    const videos = await this.prismaService.video.findMany({
      take: limit,
      skip: ( offset - 1 ) * limit,
      include: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });

    const total = await this.prismaService.video.count({});

    const lastPage = Math.ceil(total / limit);
    
    return {
      data: videos,
      meta: {
        limit,
        page: offset,
        total,
        lastPage,
      },
    };
  }

  async findOne(id: number) {

    const video = await this.prismaService.video.findFirst({
      where: { id },
    });

    if ( !video ) {
      throw new NotFoundException(`Video with ID #${ id } not found`);
    }

    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {

    await this.findOne(id);
    
    const video = await this.prismaService.video.update({
      where: { id },
      data: updateVideoDto,
    });

    return video;
  }

  async remove(id: number) {

    // Comprobar que el video existe en la BD
    await this.findOne(id);

    await this.prismaService.video.delete({
      where: { id },
    });
  }
}

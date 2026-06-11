import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateVideoDto, UpdateVideoDto } from './dto';
import { PaginationDto } from '../common/dto';
import { PrismaService } from '../prisma.service';
import { User } from 'generated/prisma/client';

@Injectable()
export class VideosService {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createVideoDto: CreateVideoDto, user: User) {

    const video = await this.prismaService.video.create({
      data: {
        ...createVideoDto,
        userId: user.id,
      },
    });

    return video;
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1} = paginationDto;

    const videos = await this.prismaService.video.findMany({
      take: limit,
      skip: ( offset - 1 ) * limit,
      where: { available: true },
      include: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });

    const total = await this.prismaService.video.count({
      where: { available: true },
    },);

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

  async findOneVideo(id: number) {

    const video = await this.prismaService.video.findFirst({
      where: { id, available: true },
    });

    if ( !video ) {
      throw new NotFoundException(`Video with ID #${ id } not found`);
    }

    return video;
  }

  async findOne(id: number, user: User) {

    const video = await this.prismaService.video.findFirst({
      where: { id, available: true, user },
    });

    if ( !video ) {
      throw new NotFoundException(`Video with ID #${ id } not found`);
    }

    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto, user: User) {

    await this.findOne(id, user);
    
    const video = await this.prismaService.video.update({
      where: { id, available: true, user },
      data: updateVideoDto,
    });

    return video;
  }

  async remove(id: number, user: User) {

    // Comprobar que el video existe en la BD
    await this.findOne(id, user);

    await this.prismaService.video.delete({
      where: { id },
    });
  }

  async deactivateVideo(id: number, user: User) {

    await this.findOne(id, user);

    const video = await this.prismaService.video.update({
      where: { id },
      data: { available: false },
    });

    return video;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateVideoDto, UpdateVideoDto } from './dto';
import { PaginationDto } from '../common/dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VideosService {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createVideoDto: CreateVideoDto) {

    const video = await this.prismaService.video.create({
      data: createVideoDto,
    });

    return video;
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1} = paginationDto;

    const videos = await this.prismaService.video.findMany({
      take: limit,
      skip: ( offset - 1 ) * limit,
    });

    const total = await this.prismaService.video.count({});

    const lastPage = Math.ceil(total / limit);
    
    return {
      data: videos,
      meta: {
        limit,
        offset,
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

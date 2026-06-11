import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { PaginationDto } from '../common/dto';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1} = paginationDto;
    
    const users = await this.prismaService.user.findMany({
      take: limit,
      skip: ( offset - 1 ) * limit,
    });

    const total = await this.prismaService.user.count({});

    const lastPage = Math.ceil(total / limit);


    return {
      data: users,
      meta: {
        limit, page: offset, total, lastPage,
      }
    }
  }

  async findOneVideos(userId: number) {

    // Buscar los videos que tiene el usuario con el ID
    const videos = await this.prismaService.user.findFirst({
      where: { id: userId },
      select: {videos: true},
    });

    // Comprobar que el usuario haya existido en la base de datos
    // Si el valor es null, entonces el usuario no existio en la BD
    if (!videos) {
      throw new NotFoundException(`User with id #${ userId } not found`);
    }

    return videos;
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if ( !user ) {
      throw new NotFoundException(`User with id #${ id } not found`);
    }
  }

  async update( id: number, updateUserDto: UpdateUserDto) {

    await this.findOne(id);

    const newUser = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });

    return newUser;
  }
}

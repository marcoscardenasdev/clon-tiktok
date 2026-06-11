import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';

import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto';
import { PaginationDto } from '../common/dto';
import { Auth, GetUser } from 'src/auth/decorators';
import type { User } from 'generated/prisma/client';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @Auth()
  create(@Body() createVideoDto: CreateVideoDto, @GetUser() user: User) {
    return this.videosService.create(createVideoDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.videosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOneVideo(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVideoDto: UpdateVideoDto, @GetUser() user: User) {
    return this.videosService.update(id, updateVideoDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.videosService.remove(id, user);
  }

  @Delete('deactivate/:id')
  deactivateVideo(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.videosService.deactivateVideo(id, user);
  }
}

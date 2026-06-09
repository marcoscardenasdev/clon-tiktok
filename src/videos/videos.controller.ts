import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';

import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto';
import { PaginationDto } from '../common/dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.videosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }

  @Delete('deactivate/:id')
  deactivateVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.deactivateVideo(id);
  }
}

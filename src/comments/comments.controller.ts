import { Controller, Get, Post, Body, Query, Param, ParseIntPipe } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from '../common/dto';

@Controller('videos')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':videoId/comments')
  create(
    @Param('videoId', ParseIntPipe) videoId: number, 
    @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(videoId, createCommentDto);
  }

  @Get(':videoId/comments')
  findAll(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Query() paginationDto: PaginationDto) {
    return this.commentsService.findAll(videoId, paginationDto);
  }
}

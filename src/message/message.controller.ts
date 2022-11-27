import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateDateImageDto } from './dto/update-date-image.dto';

@Controller('')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('message')
  @UseGuards(AuthGuard('wallet-jwt'))
  @HttpCode(201)
  @ApiOperation({ summary: '특정일에 메세지 생성 API', description: '특정일에 메세지를 생성한다' })
  // @ApiCreatedResponse({ description: '특정일에 메세지를 생성한다' })
  @ApiBearerAuth('access-token')
  create(
    @Request() { user },
    @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(user, createMessageDto);
  }

  @Get('message/:date')
  @HttpCode(200)
  @ApiOperation({ summary: '특정일 메세지 조회 API', description: '특정일에 저장된 메세지들을 조회한다' })
  // @ApiCreatedResponse({ description: '특정일에 저장된 메세지들을 조회한다' })
  findOne(
    @Param('date') date: string) {
    return this.messageService.findOne(date);
  }

  @Patch('message/:date/:id')
  @UseGuards(AuthGuard('wallet-jwt'))
  @ApiOperation({ summary: '특정일 메세지 수정 API', description: '특정일에 저장된 메세지를 수정한다' })
  // @ApiCreatedResponse({ description: '특정일에 저장된 메세지를 수정한다' })
  @ApiBearerAuth('access-token')
  update(@Request() { user }, @Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(user, +id, updateMessageDto);
  }

  @Delete('message/:date/:id')
  @UseGuards(AuthGuard('wallet-jwt'))
  @ApiOperation({ summary: '특정일 메세지 삭제 API', description: '특정일에 저장된 메세지들을 삭제한다' })
  // @ApiCreatedResponse({ description: '특정일에 저장된 메세지들을 삭제한다' })
  @ApiBearerAuth('access-token')
  remove(@Request() { user }, @Param('id') id: string) {
    return this.messageService.remove(user, +id);
  }

  @Patch('dates/image')
  @UseGuards(AuthGuard('wallet-jwt'))
  @ApiOperation({ summary: '특정일 이미지 업데이트 API', description: '특정일에 저장된 이미지를 업데이트 한다' })
  @ApiBearerAuth('access-token')
  updateDateImage(@Request() { user }, @Body() updateDateImageDto: UpdateDateImageDto) {
    return this.messageService.updateDateImage(user, updateDateImageDto);
  }

  @Get('dates')
  @HttpCode(200)
  @ApiOperation({ summary: '날짜 정보 조회 API', description: '전체 날짜 목록을 조회한다 (2023년1월 대상)' })
  // @ApiCreatedResponse({ description: '전체 날짜 목록을 조회한다 (2023년1월 대상)' })
  findAllDateInfo() {
    return this.messageService.findAllDateInfo();
  }
}

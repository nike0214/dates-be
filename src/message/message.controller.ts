import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(AuthGuard('wallet-jwt'))
  @HttpCode(201)
  create(
    @Request() { user },
  @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(user, createMessageDto);
  }

  @Get(':date')
  @HttpCode(200)
  findOne(
    @Param('date') date: string) {
    return this.messageService.findOne(date);
  }

  @Patch(':date/:id')
  @UseGuards(AuthGuard('wallet-jwt'))
  update(@Request() { user },@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(user, +id, updateMessageDto);
  }

  @Delete(':date/:id')
  @UseGuards(AuthGuard('wallet-jwt'))
  remove(@Request() { user },@Param('id') id: string) {
    return this.messageService.remove(user, +id);
  }
}

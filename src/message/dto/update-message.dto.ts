import { PartialType, PickType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PickType(PartialType(CreateMessageDto), ['message'] as const) { }

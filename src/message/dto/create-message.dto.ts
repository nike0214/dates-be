import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
    @ApiProperty({ description: '메세지 내용', example: '메세지 내용' })
    message: string;
    @ApiProperty({ description: '메세지 날짜', example: '20230101' })
    date: string;
}

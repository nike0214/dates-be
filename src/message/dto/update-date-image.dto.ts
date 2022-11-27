import { ApiProperty } from "@nestjs/swagger";

export class UpdateDateImageDto {
    @ApiProperty({ description: '메세지 날짜', example: '20230101' })
    date: string;
    @ApiProperty({ description: '이미지 url', example: 'https://dates-temp.s3.ap-northeast-2.amazonaws.com/white_default.png' })
    imgUrl: string;
}

import { IsString, IsUUID, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  roomId!: string;

  @IsString()
  @MinLength(1)
  content!: string;
}

import { IsUUID } from 'class-validator';

export class CreateDmRoomDto {
  @IsUUID()
  otherUserId!: string;
}

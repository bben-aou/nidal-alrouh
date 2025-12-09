import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateDmRoomDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  otherUsername?: string;

  @IsOptional()
  @IsUUID()
  otherUserId?: string;
}

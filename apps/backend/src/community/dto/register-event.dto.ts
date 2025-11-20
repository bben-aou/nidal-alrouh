import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RegisterEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

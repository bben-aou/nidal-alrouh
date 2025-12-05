import {
  IsDateString,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  helperId!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  time!: string;

  @IsString()
  @IsNotEmpty()
  timezone!: string;

  @IsNumber()
  @Min(30)
  duration!: number;

  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

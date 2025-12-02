import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateHelperProfileDto {
  @IsString()
  @MinLength(50, { message: 'Bio must be at least 50 characters' })
  @MaxLength(1000, { message: 'Bio must not exceed 1000 characters' })
  bio!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one specialization is required' })
  @ArrayMaxSize(10)
  @IsString({ each: true })
  specializations!: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one language is required' })
  @ArrayMaxSize(5)
  @IsString({ each: true })
  languages!: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxSessionsPerWeek?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  calUsername?: string;

  @IsOptional()
  @IsString()
  calEventTypeId?: string;

  @IsOptional()
  @IsString()
  bookingUrl?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  yearsOfExperience?: number;
}

import { ReflectionMood, ReflectionPrivacy } from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateReflectionDto {
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title!: string;

  @IsString()
  @MinLength(1, { message: 'Content cannot be empty' })
  @MaxLength(10000, { message: 'Content cannot exceed 10000 characters' })
  content!: string;

  @IsEnum(ReflectionMood, { message: 'Invalid mood value' })
  mood!: ReflectionMood;

  @IsOptional()
  @IsEnum(ReflectionPrivacy, { message: 'Invalid privacy value' })
  privacy?: ReflectionPrivacy;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

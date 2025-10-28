import { SupportedPromptLocale } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetPostsQueryDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  cursor?: string;

  @IsEnum(SupportedPromptLocale)
  @IsOptional()
  locale?: SupportedPromptLocale;

  @IsString()
  @IsOptional()
  userId?: string;
}

import { SupportedPromptLocale, PostPrivacy } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsEnum(PostPrivacy)
  @IsOptional()
  privacy?: PostPrivacy;

  @IsEnum(SupportedPromptLocale)
  @IsOptional()
  locale?: SupportedPromptLocale;
}

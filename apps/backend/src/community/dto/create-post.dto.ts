import { SupportedPromptLocale, PostPrivacy } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(5000)
  content!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean = false;

  @IsEnum(PostPrivacy)
  @IsOptional()
  privacy?: PostPrivacy = PostPrivacy.PUBLIC;

  @IsEnum(SupportedPromptLocale)
  locale!: SupportedPromptLocale;

  @IsString()
  @IsOptional()
  quotedPostId?: string;
}

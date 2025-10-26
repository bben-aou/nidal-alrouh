import { SupportedPromptLocale } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class GetPromptsDto {
  @IsOptional()
  @IsEnum(SupportedPromptLocale, { message: 'Invalid locale value' })
  locale?: SupportedPromptLocale;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Offset must be an integer' })
  @Min(0, { message: 'Offset must be at least 0' })
  offset?: number;
}

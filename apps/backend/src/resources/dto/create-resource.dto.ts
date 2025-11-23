import { ResourceType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsEnum(ResourceType)
  type!: ResourceType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @ValidateIf((o) => o.url && o.url.length > 0)
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

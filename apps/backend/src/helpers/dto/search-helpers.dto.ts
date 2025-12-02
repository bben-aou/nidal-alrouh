import { HelperStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';

export class SearchHelpersDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  specializations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  languages?: string[];

  @IsOptional()
  @IsEnum(HelperStatus)
  status?: HelperStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;
}

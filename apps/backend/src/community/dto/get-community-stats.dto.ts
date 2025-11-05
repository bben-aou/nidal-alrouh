import { Transform } from 'class-transformer';
import { IsOptional, IsDateString, ValidateIf, IsIn } from 'class-validator';

export enum StatsPeriod {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  ALL = 'ALL',
  CUSTOM = 'CUSTOM',
}

export class GetCommunityStatsDto {
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsIn(['WEEK', 'MONTH', 'ALL', 'CUSTOM'], {
    message: 'Invalid period value. Must be one of: WEEK, MONTH, ALL, CUSTOM',
  })
  period?: StatsPeriod = StatsPeriod.WEEK;

  @ValidateIf((o) => o.period === StatsPeriod.CUSTOM)
  @IsDateString({}, { message: 'Invalid start date format' })
  startDate?: string;

  @ValidateIf((o) => o.period === StatsPeriod.CUSTOM)
  @IsDateString({}, { message: 'Invalid end date format' })
  endDate?: string;
}

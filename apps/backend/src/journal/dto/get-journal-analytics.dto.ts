import { Transform } from 'class-transformer';
import { IsOptional, IsDateString, IsIn } from 'class-validator';

export enum AnalyticsGranularity {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class GetJournalAnalyticsDto {
  @IsOptional()
  @IsDateString({}, { message: 'Invalid start date format' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid end date format' })
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  @IsIn(['day', 'week', 'month'], {
    message: 'Invalid granularity value. Must be one of: day, week, month',
  })
  granularity?: AnalyticsGranularity = AnalyticsGranularity.DAY;
}

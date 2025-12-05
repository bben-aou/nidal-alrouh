import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class AvailableSlotsDto {
  @IsString()
  @IsNotEmpty()
  helperId!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class AvailableSlotsResponseDto {
  date!: string;
  timezone!: string;
  availableSlots!: Array<{
    time: string;
    duration: number;
    platform: string;
  }>;
}

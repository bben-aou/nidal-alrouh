import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Comment content cannot be empty' })
  @MaxLength(2000, { message: 'Comment content cannot exceed 2000 characters' })
  content!: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = false;
}

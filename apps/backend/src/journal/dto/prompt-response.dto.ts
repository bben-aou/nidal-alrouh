import { SupportedPromptLocale } from '@prisma/client';

export class PromptResponseDto {
  id!: string;
  text!: string;
  tags!: string[];
  locale!: SupportedPromptLocale;
  category?: string;
}

export class PromptsListResponseDto {
  prompts!: PromptResponseDto[];
  total?: number;
  hasMore?: boolean;
}

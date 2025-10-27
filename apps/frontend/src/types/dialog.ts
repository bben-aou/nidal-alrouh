import { PrivacyOption } from './journal';

export interface CreateReflectionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialTitle?: string;
  initialContent?: string;
  initialMood?: string;
  initialTags?: string[];
  initialPrivacy?: PrivacyOption;
  hideTrigger?: boolean;
  triggerText?: string;
  contentPlaceholder?: string;
}

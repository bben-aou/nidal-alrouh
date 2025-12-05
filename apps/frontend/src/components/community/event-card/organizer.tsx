import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommunityEvent } from '@/types/community';

interface Props {
  organizer: CommunityEvent['organizer'];
}

export function EventCardOrganizer({ organizer }: Props) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Avatar className="h-8 w-8">
        {organizer.avatar && (
          <AvatarImage
            src={organizer.avatar ?? '/default-profile.jpg'}
            alt={organizer.name}
          />
        )}
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <p className="font-medium">{organizer.name}</p>
        {organizer.role && (
          <p className="text-muted-foreground">{organizer.role}</p>
        )}
      </div>
    </div>
  );
}

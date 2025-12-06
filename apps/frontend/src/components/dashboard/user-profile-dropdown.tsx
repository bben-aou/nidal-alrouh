'use client';

import { LogOut, Settings, User, Heart } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { TUserRole } from '@/types/user';

interface User {
  name?: string;
  email?: string;
  avatar?: string;
  role?: TUserRole;
}

interface UserProfileDropdownProps {
  user: User | null;
  onLogout: () => void;
}

export function UserProfileDropdown({
  user,
  onLogout,
}: UserProfileDropdownProps) {
  const isHelper = user?.role === TUserRole.HELPER;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full overflow-hidden hover:bg-primary/5 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar ?? '/default-profile.jpg'} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {user?.name?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              {isHelper && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/15 text-[10px] px-1.5 py-0 h-4 font-medium"
                >
                  <Heart className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  Helper
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

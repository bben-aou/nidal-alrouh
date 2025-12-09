'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { useSearchUsers } from '@/apis/users/queries/use-search-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface ChatNewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat: (payload: {
    otherUserId?: string;
    otherUsername?: string;
  }) => void;
}

export default function ChatNewChatDialog({
  open,
  onOpenChange,
  onStartChat,
}: Readonly<ChatNewChatDialogProps>) {
  const t = useTranslations('chat');
  const [query, setQuery] = useState('');
  const { data: results = [], isPending } = useSearchUsers(query, 400);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const showEmpty = useMemo(
    () => query.trim().length >= 2 && !isPending && results.length === 0,
    [query, isPending, results.length]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle>{t('sidebar.newChatDialogTitle')}</DialogTitle>
        <DialogDescription>
          {t('sidebar.newChatDialogDescription')}
        </DialogDescription>
      </VisuallyHidden>
      <CommandInput
        placeholder={t('sidebar.otherUsernamePlaceholder')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isPending && query.trim().length >= 2 && (
          <div className="flex h-40 w-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t('sidebar.searching')}</span>
          </div>
        )}
        <CommandEmpty>
          {showEmpty ? t('sidebar.noUserResults') : t('sidebar.newChatHelp')}
        </CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading={t('sidebar.newChat')}>
            {results.map((u) => (
              <CommandItem
                key={u.id}
                value={[u.name ?? '', u.username ?? '', u.id].join(' ').trim()}
                onSelect={() => onStartChat({ otherUserId: u.id })}
                className="rounded-lg transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground data-[selected=true]:border data-[selected=true]:border-primary/20 my-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={u.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {(u.name ?? 'U').slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {u.name || u.username || 'User'}
                    </div>
                    {u.username ? (
                      <div className="text-xs text-muted-foreground">
                        {u.username}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      <div className="flex items-center justify-between border-t p-3">
        <div className="text-xs text-muted-foreground">
          {t('sidebar.newChatHelp')}
        </div>
        <button
          className="rounded-md border px-3 py-2 text-xs hover:bg-muted disabled:opacity-50"
          disabled={!query.trim()}
          onClick={() => onStartChat({ otherUsername: query.trim() })}
        >
          {t('sidebar.startChat')}
        </button>
      </div>
    </CommandDialog>
  );
}

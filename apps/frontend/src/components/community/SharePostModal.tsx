'use client';

import { Copy, Share2, Quote } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Post } from '@/types/community';

interface SharePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
  onQuoteShare?: () => void;
}

export function SharePostModal({
  open,
  onOpenChange,
  post,
  onQuoteShare,
}: Readonly<SharePostModalProps>) {
  const t = useTranslations('community');
  const locale = useLocale();

  const buildShareUrl = () => {
    try {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      const url = new URL(origin);
      url.pathname = `/${locale}/dashboard/community`;
      url.search = `?post=${encodeURIComponent(post.id)}&utm_medium=share&utm_source=community`;
      return url.toString();
    } catch {
      return `/${locale}/dashboard/community?post=${encodeURIComponent(post.id)}`;
    }
  };

  const shareUrl = buildShareUrl();
  const authorLabel = post.author;
  const snippet = (post.content || '').trim().slice(0, 140);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success(t('dashboard.shareModal.copied'));
      onOpenChange(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error?.message || t('dashboard.shareModal.shareFailed'));
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({
          title: t('dashboard.title'),
          text: `${authorLabel}: ${snippet}`,
          url: shareUrl,
        });
        onOpenChange(false);
      } else {
        await handleCopyLink();
      }
    } catch {
      // If user cancels or share fails, provide non-intrusive feedback
      toast.error(t('dashboard.shareModal.shareFailed'));
    }
  };

  const handleQuoteShare = () => {
    onOpenChange(false);
    onQuoteShare?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('dashboard.shareModal.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">{authorLabel}</p>
            <p className="line-clamp-3">{snippet}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              onClick={handleCopyLink}
              className="w-full justify-center gap-2"
              title={t('dashboard.shareModal.copyLink')}
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              {t('dashboard.shareModal.copyLink')}
            </Button>
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="w-full justify-center gap-2"
              title={t('dashboard.shareModal.nativeShare')}
            >
              <Share2 className="h-4 w-4" />
              {t('dashboard.shareModal.nativeShare')}
            </Button>
            <Button
              variant="outline"
              onClick={handleQuoteShare}
              className="w-full justify-center gap-2 sm:col-span-2"
              title={t('dashboard.shareModal.quoteShare')}
            >
              <Quote className="h-4 w-4" />
              {t('dashboard.shareModal.quoteShare')}
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {t('dashboard.reportModal.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

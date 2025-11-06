'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useGetPostById,
  useLikePost,
  useUnlikePost,
  useHidePost,
  useUnhidePost,
} from '@/apis/community/queries';
import { PostCard } from '@/components/community/PostCard';
import { ReportPostModal } from '@/components/community/ReportPostModal';
import { SharePostModal } from '@/components/community/SharePostModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { transformCommunityPosts } from '@/lib/utils/community';
import type { Post } from '@/types/community';

export default function SingleCommunityPostPage() {
  const t = useTranslations('community');
  const params = useParams<{ postId: string }>();
  const postId = params?.postId;

  const [post, setPost] = useState<Post | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const { post: apiPost, isLoading, isError } = useGetPostById({ postId });

  useEffect(() => {
    if (apiPost) {
      const [mapped] = transformCommunityPosts([apiPost], (key) => t(key));
      setPost(mapped ?? null);
    }
  }, [apiPost, t]);

  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const hideMutation = useHidePost();
  const unhideMutation = useUnhidePost();

  const handlers = useMemo(
    () => ({
      onLike: (id: string) => {
        setPost((prev) => {
          if (!prev) return prev;
          const liked = !prev.likedByMe;
          const likes = liked ? prev.likes + 1 : Math.max(prev.likes - 1, 0);
          return { ...prev, likedByMe: liked, likes };
        });

        const likedByMe = post?.likedByMe;
        if (likedByMe) {
          unlikeMutation.unlikePostWithParams({ postId: id });
        } else {
          likeMutation.likePostWithParams({ postId: id });
        }
      },
      onComment: () => {
        // Comment toggling is handled inside PostCard; counts update via realtime or fetch refresh
      },
      onShare: () => {
        if (post?.hidden) {
          toast.error(t('dashboard.shareModal.notShareable'));
          return;
        }
        setShareOpen(true);
      },
      onReport: () => setReportOpen(true),
      onHide: (id: string) => {
        setPost((prev) => (prev ? { ...prev, hidden: true } : prev));
        hideMutation.hidePostWithParams({ postId: id });
      },
      onUnhide: (id: string) => {
        setPost((prev) => (prev ? { ...prev, hidden: false } : prev));
        unhideMutation.unhidePostWithParams({ postId: id });
      },
    }),
    [likeMutation, unlikeMutation, hideMutation, unhideMutation, post, t]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/community">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-2">{t('dashboard.backToCommunity')}</span>
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="h-4 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/community">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-2">{t('dashboard.backToCommunity')}</span>
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t('dashboard.postNotFound')}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/community">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-2">{t('dashboard.backToCommunity')}</span>
          </Link>
        </Button>
      </div>

      <PostCard
        post={post}
        onLike={handlers.onLike}
        onComment={handlers.onComment}
        onShare={handlers.onShare}
        onReport={handlers.onReport}
        onHide={handlers.onHide}
        onUnhide={handlers.onUnhide}
      />

      <SharePostModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        post={post}
      />
      <ReportPostModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        postId={post.id}
      />
    </div>
  );
}

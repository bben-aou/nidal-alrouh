'use client';

import { Plus, Search, Filter, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CreatePostCard } from '@/components/community/CreatePostCard';
import { PostCard } from '@/components/community/PostCard';
import { ReportPostModal } from '@/components/community/ReportPostModal';
import { SharePostModal } from '@/components/community/SharePostModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { CreatePostFormData } from '@/lib/validations/community';
import type { Post } from '@/types/community';

interface FeedTabProps {
  visiblePosts: Post[];
  isLoading: boolean;
  onPostSubmit: (data: CreatePostFormData) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
  onHide: (postId: string) => void;
  onUnhide: (postId: string) => void;
  onCreatePostFocus: () => void;
}

export function FeedTab({
  visiblePosts,
  isLoading,
  onPostSubmit,
  onLike,
  onComment,
  onShare,
  onReport,
  onHide,
  onUnhide,
  onCreatePostFocus,
}: Readonly<FeedTabProps>) {
  const t = useTranslations('community');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [quotedPost, setQuotedPost] = useState<Post | null>(null);

  const handleReportClick = (postId: string) => {
    setReportPostId(postId);
    setReportOpen(true);
    onReport(postId);
  };

  const handleShareClick = (post: Post) => {
    if (post.hidden) {
      return;
    }
    setSharePost(post);
    setShareOpen(true);
    onShare(post.id);
  };

  const handleQuoteShare = () => {
    if (sharePost) {
      setQuotedPost(sharePost);
      onCreatePostFocus();
    }
  };

  const handleRemoveQuotedPost = () => {
    setQuotedPost(null);
  };

  return (
    <div className="space-y-4">
      <div data-create-post>
        <CreatePostCard
          onPostSubmit={onPostSubmit}
          quotedPost={quotedPost ?? undefined}
          onRemoveQuotedPost={handleRemoveQuotedPost}
        />
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('dashboard.searchPosts')} className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          {t('dashboard.filter')}
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              {t('dashboard.emptyState.loading')}
            </div>
          </div>
        ) : visiblePosts.length > 0 ? (
          visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onComment={onComment}
              onShare={() => handleShareClick(post)}
              onReport={handleReportClick}
              onHide={onHide}
              onUnhide={onUnhide}
            />
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('dashboard.emptyState.title')}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {t('dashboard.emptyState.description')}
              </p>
              <Button onClick={onCreatePostFocus} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.emptyState.createFirstPost')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {reportPostId && (
        <ReportPostModal
          open={reportOpen}
          onOpenChange={setReportOpen}
          postId={reportPostId}
        />
      )}

      {sharePost && (
        <SharePostModal
          open={shareOpen}
          onOpenChange={setShareOpen}
          post={sharePost}
          onQuoteShare={handleQuoteShare}
        />
      )}
    </div>
  );
}

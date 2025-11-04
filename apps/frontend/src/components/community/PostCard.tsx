'use client';

import { MoreHorizontal, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type Post } from '@/types/community';

import { CommentComposer } from './CommentComposer';
import { CommentList } from './CommentList';

interface PostCardProps {
  post: Post;
  className?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onHide?: (postId: string) => void;
  onUnhide?: (postId: string) => void;
}

export function PostCard({
  post,
  className,
  onLike,
  onComment,
  onShare,
  onReport,
  onHide,
  onUnhide,
}: Readonly<PostCardProps>) {
  const t = useTranslations('community');
  const [showComments, setShowComments] = useState(false);

  const handleCommentToggle = () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);

    onComment?.(post.id);
  };

  return (
    <Card key={post.id} className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{post.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">{post.time}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => onReport?.(post.id)}>
                {t('dashboard.report')}
              </DropdownMenuItem>
              {post.hidden ? (
                <DropdownMenuItem onSelect={() => onUnhide?.(post.id)}>
                  {t('dashboard.unhide')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => onHide?.(post.id)}>
                  {t('dashboard.hide')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{post.content}</p>
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-2 border-t">
          <Button
            variant={post.likedByMe ? 'default' : 'ghost'}
            size="sm"
            aria-pressed={post.likedByMe}
            onClick={() => onLike?.(post.id)}
            className="group transition-all duration-200 ease-in-out"
          >
            <ThumbsUp
              className={cn(
                'mr-2 h-4 w-4 transition-all duration-200',
                post.likedByMe
                  ? 'text-primary-foreground scale-110'
                  : 'text-muted-foreground group-hover:text-primary/80'
              )}
            />
            <span
              className={cn(
                'transition-colors duration-200',
                post.likedByMe
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              {post.likes}
            </span>
          </Button>
          <Button
            variant={showComments ? 'default' : 'ghost'}
            size="sm"
            onClick={handleCommentToggle}
            className="group transition-all duration-200 ease-in-out"
          >
            <MessageSquare
              className={cn(
                'mr-2 h-4 w-4 transition-all duration-200',
                showComments
                  ? 'text-primary-foreground scale-110'
                  : 'text-muted-foreground group-hover:text-primary/80'
              )}
            />
            <span
              className={cn(
                'transition-colors duration-200',
                showComments
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              {post.comments}
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare?.(post.id)}>
            <Share2 className="mr-2 h-4 w-4" />
            {t('dashboard.share')}
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <CommentComposer postId={post.id} t={t} />
            <CommentList postId={post.id} t={t} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

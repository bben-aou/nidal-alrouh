'use client';

import { MoreHorizontal, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
import { type Post } from '@/types/community';

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
              <DropdownMenuItem onClick={() => onReport?.(post.id)}>
                {t('dashboard.report')}
              </DropdownMenuItem>
              {post.hidden ? (
                <DropdownMenuItem onClick={() => onUnhide?.(post.id)}>
                  {t('dashboard.unhide')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onHide?.(post.id)}>
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
          <Button variant="ghost" size="sm" onClick={() => onLike?.(post.id)}>
            <ThumbsUp className="mr-2 h-4 w-4" />
            {post.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment?.(post.id)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {post.comments}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare?.(post.id)}>
            <Share2 className="mr-2 h-4 w-4" />
            {t('dashboard.share')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

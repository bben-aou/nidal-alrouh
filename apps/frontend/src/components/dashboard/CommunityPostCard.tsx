'use client';

import { Heart, MessageCircle } from 'lucide-react';

import type { CommunityPost } from '@/services/community-api.service';

interface CommunityPostCardProps {
  post: CommunityPost;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          {post.user?.avatarUrl ? (
            <img
              src={post.user.avatarUrl}
              alt={post.user.name || 'User'}
              className="h-10 w-10 rounded-full ring-2 ring-background shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background shadow-sm transition-transform duration-300 group-hover:scale-105">
              <span className="text-sm font-bold text-primary">
                {post.user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground truncate">
                {post.user?.name || 'Anonymous'}
              </p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Post
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="relative">
          <p className="text-sm leading-relaxed text-foreground/90 mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {post.content}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground transition-colors group-hover:text-red-500">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium">
              {post.likesCount || post._count?.likes || 0} Likes
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground transition-colors group-hover:text-primary">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">
              {post.commentsCount || post._count?.comments || 0} Comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

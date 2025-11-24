import type { Resource } from '@/types/resource';

export function getYouTubeThumbnail(url: string): string | null {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  );
  if (videoIdMatch?.[1]) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/mqdefault.jpg`;
  }
  return null;
}

export function getResourceThumbnail(resource: Resource): string {
  if (resource.type === 'VIDEO' && resource.url) {
    const ytThumbnail = getYouTubeThumbnail(resource.url);
    if (ytThumbnail) return ytThumbnail;
  }
  return '/default-article.jpg';
}

export function calculateReadTime(resource: Resource): string {
  if (resource.type === 'ARTICLE' && resource.content) {
    const words = resource.content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  }
  if (resource.type === 'VIDEO') {
    return '15 min';
  }
  return '5 min';
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export const TYPE_LABELS = {
  ARTICLE: 'Article',
  VIDEO: 'Video',
  LINK: 'Link',
} as const;

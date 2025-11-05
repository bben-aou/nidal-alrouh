export interface CommunityStatsResponseDto {
  totalPosts: number;
  totalPostsChange: number;
  totalLikes: number;
  totalLikesChange: number;
  totalComments: number;
  totalCommentsChange: number;
  activeMembers: number;
  activeMembersChange: number;
  upcomingEvents: number;
  upcomingEventsChange: number;
  period: {
    start: string;
    end: string;
  };
}

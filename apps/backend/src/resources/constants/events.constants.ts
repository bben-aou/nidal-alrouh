export enum ResourceEvent {
  ResourceCreated = 'resource.created',
  ResourceUpdated = 'resource.updated',
  ResourceDeleted = 'resource.deleted',

  ResourceBookmarked = 'resource.bookmarked',
  ResourceUnbookmarked = 'resource.unbookmarked',
  ResourceViewed = 'resource.viewed',
  ResourceCompleted = 'resource.completed',

  BookmarkProgressUpdated = 'bookmark.progress.updated',

  UserStatsUpdated = 'user.stats.updated',
}

import { notificationRepository } from "../repositories/notification.repository";

export const notificationService = {
  /** Get notifications for a user */
  async getByUser(userId: string, limit = 20, includeRead = false) {
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.findByUser(userId, limit, includeRead),
      notificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  },

  /** Get unread notification count */
  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId);
  },

  /** Create a notification */
  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    metadata?: object;
  }) {
    return notificationRepository.create(data);
  },

  /** Mark a single notification as read */
  async markAsRead(id: string, userId: string) {
    return notificationRepository.markAsRead(id, userId);
  },

  /** Mark all notifications as read */
  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  },

  // --- Helper methods for common notification types ---

  /** Notify user about a new comment on their post */
  async notifyComment(userId: string, postTitle: string, commentAuthor: string, postId: string) {
    return notificationRepository.create({
      userId,
      type: "COMMENT",
      title: "새 댓글",
      message: `${commentAuthor}님이 "${postTitle}" 게시글에 댓글을 남겼습니다.`,
      link: `/community/${postId}`,
      metadata: { postId, commentAuthor },
    });
  },

  /** Notify user about a like on their post */
  async notifyLike(userId: string, postTitle: string, likerName: string, postId: string) {
    return notificationRepository.create({
      userId,
      type: "LIKE",
      title: "좋아요",
      message: `${likerName}님이 "${postTitle}" 게시글에 좋아요를 눌렀습니다.`,
      link: `/community/${postId}`,
      metadata: { postId, likerName },
    });
  },

  /** Notify user about earning a badge */
  async notifyBadge(userId: string, badgeName: string) {
    return notificationRepository.create({
      userId,
      type: "BADGE",
      title: "새 뱃지 획득!",
      message: `"${badgeName}" 뱃지를 획득했습니다!`,
      link: "/profile/badges",
      metadata: { badgeName },
    });
  },

  /** Notify user about a new follower */
  async notifyFollow(userId: string, followerName: string) {
    return notificationRepository.create({
      userId,
      type: "FOLLOW",
      title: "새 팔로워",
      message: `${followerName}님이 회원님을 팔로우합니다.`,
      metadata: { followerName },
    });
  },
};

import { followRepository } from "../repositories/follow.repository";
import { notificationService } from "./notification.service";
import { userRepository } from "../repositories/user.repository";

export const followService = {
  /** Toggle follow. Returns true if now following, false if unfollowed. */
  async toggle(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error("자기 자신을 팔로우할 수 없습니다");
    }

    const isNowFollowing = await followRepository.toggle(followerId, followingId);

    // Send notification on follow (not unfollow)
    if (isNowFollowing) {
      const follower = await userRepository.findById(followerId);
      if (follower) {
        await notificationService.notifyFollow(
          followingId,
          follower.nickname ?? follower.name ?? "사용자"
        );
      }
    }

    return isNowFollowing;
  },

  /** Check if followerId is following followingId */
  async isFollowing(followerId: string, followingId: string) {
    return followRepository.isFollowing(followerId, followingId);
  },

  /** Get followers of a user */
  async getFollowers(userId: string, limit?: number) {
    return followRepository.getFollowers(userId, limit);
  },

  /** Get users that a user is following */
  async getFollowing(userId: string, limit?: number) {
    return followRepository.getFollowing(userId, limit);
  },

  /** Get follower count */
  async getFollowerCount(userId: string) {
    return followRepository.getFollowerCount(userId);
  },

  /** Get following count */
  async getFollowingCount(userId: string) {
    return followRepository.getFollowingCount(userId);
  },

  /** Get follow status and counts for a target user, from the perspective of a viewer */
  async getStatus(viewerId: string | null, targetUserId: string) {
    const [followerCount, followingCount, isFollowing] = await Promise.all([
      followRepository.getFollowerCount(targetUserId),
      followRepository.getFollowingCount(targetUserId),
      viewerId ? followRepository.isFollowing(viewerId, targetUserId) : Promise.resolve(false),
    ]);

    return { isFollowing, followerCount, followingCount };
  },
};

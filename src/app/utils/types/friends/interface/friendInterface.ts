// A user you follow / who follows you
interface FriendUser {
    userId: string;
    name: string;
    profileImage: string;
    followedAt: string; // or Date
}

// An item you liked
interface LikedItem {
    itemId: string;
    title: string;
    sellerId: string;
    likedAt: string; // or Date
}

// Friends object structure
export interface Friends {
    following: FriendUser[];
    followers: FriendUser[];
    likedItems: LikedItem[];
}

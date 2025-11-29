
export interface Movie {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  uploadedAt: Date;
  isNew?: boolean;
  isPremium: boolean; // true for movies, false for music videos
}

export interface MusicVideo {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: number;
  addedAt: Date;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  hasSubscription: boolean;
  subscriptionExpiresAt?: Date;
}

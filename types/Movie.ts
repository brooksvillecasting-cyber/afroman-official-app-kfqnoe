
export interface Movie {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  uploadedAt: Date;
  isNew?: boolean;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  hasSubscription: boolean;
  subscriptionExpiresAt?: Date;
}

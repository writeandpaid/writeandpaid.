


export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  country: string;
  state: string;
  createdAt: string;
  // Referral System Fields
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  rewardPoints: number;
  isAdmin?: boolean;
  completedCourses?: string[];
  emailVerified?: boolean;
  package: 'bronze' | 'gold' | 'platinum';
}

export interface Course {
  title: string;
  description: string;
  videoUrl: string;
  module: string;
  order: number;
  createdAt: string;
  price: number; // Price in cents
}

export interface Enrollment {
    userId: string;
    courseId: string;
    createdAt: string;
    orderId: string;
}

export interface Payout {
    userId: string;
    amount: number; // in points
    createdAt: string;
    status: 'pending' | 'completed';
}

export interface Lead {
    firstName: string;
    email: string;
    phone: string;
    ref: string | null;
    createdAt: string;
}

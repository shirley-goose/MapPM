// User Profile Types
export interface UserProfile {
  id: string;
  cognitoId: string;
  email: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  experience: ExperienceLevel;
  pmFocus: PMFocus[];
  industry: Industry[];
  companyStage: CompanyStage[];
  skills: Skill[];
  interests: Interest[];
  location?: UserLocation;
  privacy: PrivacySettings;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserStatus = 'job-seeker' | 'current-employee' | 'open-to-opportunities' | 'hiring-manager';

export type ExperienceLevel = 'intern' | 'associate-pm' | 'pm' | 'senior-pm' | 'principal-pm' | 'director-plus';

export type PMFocus =
  | 'technical-pm'
  | 'growth-pm'
  | 'data-pm'
  | 'ai-ml-pm'
  | 'platform-pm'
  | 'consumer-pm'
  | 'b2b-pm'
  | 'product-ops';

export type Industry =
  | 'saas'
  | 'e-commerce'
  | 'healthcare'
  | 'fintech'
  | 'gaming'
  | 'edtech'
  | 'crypto'
  | 'hardware'
  | 'media'
  | 'real-estate';

export type CompanyStage =
  | 'pre-seed'
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'series-c'
  | 'late-stage'
  | 'public'
  | 'enterprise';

export type Skill =
  | 'strategy'
  | 'analytics'
  | 'technical'
  | 'design'
  | 'leadership'
  | 'go-to-market'
  | 'user-research'
  | 'data-analysis';

export type Interest =
  | 'mentoring'
  | 'job-hunting'
  | 'networking'
  | 'knowledge-sharing'
  | 'startup-founding'
  | 'investing';

export interface UserLocation {
  country: string;
  state?: string;
  city: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isVisible: boolean;
}

export interface PrivacySettings {
  showLocation: boolean;
  showExperience: boolean;
  showCompany: boolean;
  allowConnections: boolean;
  anonymousMode: boolean;
}

// Forum Types
export interface ForumPost {
  id: string;
  authorId: string;
  author: Pick<UserProfile, 'name' | 'avatar' | 'experience' | 'pmFocus'>;
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export type ForumCategory =
  | 'job-market'
  | 'interview-prep'
  | 'career-growth'
  | 'product-strategy'
  | 'industry-news'
  | 'general';

export interface Comment {
  id: string;
  authorId: string;
  author: Pick<UserProfile, 'name' | 'avatar'>;
  content: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;
  type: ResourceType;
  submittedBy: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  isVerified: boolean;
  createdAt: Date;
}

export type ResourceCategory =
  | 'interview-prep'
  | 'courses'
  | 'communities'
  | 'tools'
  | 'content'
  | 'templates';

export type ResourceType =
  | 'article'
  | 'video'
  | 'course'
  | 'tool'
  | 'template'
  | 'book'
  | 'podcast';

// Connection Types
export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
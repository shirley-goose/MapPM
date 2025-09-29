import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  auth0Id: string;
  email: string;
  name: string;
  avatar?: string;
  status: 'job-seeker' | 'current-employee' | 'open-to-opportunities' | 'hiring-manager';
  experience: 'intern' | 'associate-pm' | 'pm' | 'senior-pm' | 'principal-pm' | 'director-plus';
  pmFocus: ('technical-pm' | 'growth-pm' | 'data-pm' | 'ai-ml-pm' | 'platform-pm' | 'consumer-pm' | 'b2b-pm' | 'product-ops')[];
  industry: ('saas' | 'e-commerce' | 'healthcare' | 'fintech' | 'gaming' | 'edtech' | 'crypto' | 'hardware' | 'media' | 'real-estate')[];
  companyStage: ('pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'late-stage' | 'public' | 'enterprise')[];
  skills: ('strategy' | 'analytics' | 'technical' | 'design' | 'leadership' | 'go-to-market' | 'user-research' | 'data-analysis')[];
  interests: ('mentoring' | 'job-hunting' | 'networking' | 'knowledge-sharing' | 'startup-founding' | 'investing')[];
  location?: {
    country: string;
    state?: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    isVisible: boolean;
  };
  privacy: {
    showLocation: boolean;
    showExperience: boolean;
    showCompany: boolean;
    allowConnections: boolean;
    anonymousMode: boolean;
  };
  lastActive: Date;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  status: {
    type: String,
    enum: ['job-seeker', 'current-employee', 'open-to-opportunities', 'hiring-manager'],
    required: true,
  },
  experience: {
    type: String,
    enum: ['intern', 'associate-pm', 'pm', 'senior-pm', 'principal-pm', 'director-plus'],
    required: true,
  },
  pmFocus: [{
    type: String,
    enum: ['technical-pm', 'growth-pm', 'data-pm', 'ai-ml-pm', 'platform-pm', 'consumer-pm', 'b2b-pm', 'product-ops'],
  }],
  industry: [{
    type: String,
    enum: ['saas', 'e-commerce', 'healthcare', 'fintech', 'gaming', 'edtech', 'crypto', 'hardware', 'media', 'real-estate'],
  }],
  companyStage: [{
    type: String,
    enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'late-stage', 'public', 'enterprise'],
  }],
  skills: [{
    type: String,
    enum: ['strategy', 'analytics', 'technical', 'design', 'leadership', 'go-to-market', 'user-research', 'data-analysis'],
  }],
  interests: [{
    type: String,
    enum: ['mentoring', 'job-hunting', 'networking', 'knowledge-sharing', 'startup-founding', 'investing'],
  }],
  location: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isVisible: { type: Boolean, default: true },
  },
  privacy: {
    showLocation: { type: Boolean, default: true },
    showExperience: { type: Boolean, default: true },
    showCompany: { type: Boolean, default: true },
    allowConnections: { type: Boolean, default: true },
    anonymousMode: { type: Boolean, default: false },
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
UserSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IUser>('User', UserSchema);
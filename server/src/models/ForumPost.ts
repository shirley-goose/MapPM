import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  _id: string;
  authorId: string;
  content: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface IForumPost extends Document {
  authorId: string;
  title: string;
  content: string;
  category: 'job-market' | 'interview-prep' | 'career-growth' | 'product-strategy' | 'industry-news' | 'general';
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: IComment[];
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  authorId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  parentId: {
    type: String,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const ForumPostSchema: Schema = new Schema({
  authorId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  category: {
    type: String,
    enum: ['job-market', 'interview-prep', 'career-growth', 'product-strategy', 'industry-news', 'general'],
    required: true,
    index: true,
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  comments: [CommentSchema],
  viewCount: {
    type: Number,
    default: 0,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Text search index
ForumPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
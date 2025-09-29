import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  url: string;
  category: 'interview-prep' | 'courses' | 'communities' | 'tools' | 'content' | 'templates';
  type: 'article' | 'video' | 'course' | 'tool' | 'template' | 'book' | 'podcast';
  submittedBy: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  isVerified: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  price?: 'free' | 'paid' | 'freemium';
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['interview-prep', 'courses', 'communities', 'tools', 'content', 'templates'],
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['article', 'video', 'course', 'tool', 'template', 'book', 'podcast'],
    required: true,
  },
  submittedBy: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  price: {
    type: String,
    enum: ['free', 'paid', 'freemium'],
  },
}, {
  timestamps: true,
});

// Text search index
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IResource>('Resource', ResourceSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema = new Schema({
  requesterId: {
    type: String,
    required: true,
    index: true,
  },
  recipientId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending',
    index: true,
  },
  message: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique connections between users
ConnectionSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export default mongoose.model<IConnection>('Connection', ConnectionSchema);
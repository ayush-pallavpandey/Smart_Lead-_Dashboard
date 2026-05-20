import mongoose, { Schema } from 'mongoose';
import { ILead } from '../types';

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);

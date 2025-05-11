import mongoose, { Document, Schema } from 'mongoose';

export interface IAction extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  category: string;
  points: number;
  icon: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const actionSchema = new Schema<IAction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update user points when a new action is created
actionSchema.post('save', async function () {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(this.user, {
    $inc: { points: this.points },
  });
});

export const Action = mongoose.model<IAction>('Action', actionSchema); 
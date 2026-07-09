import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  recentlyPlayed: [{
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
    playedAt: { type: Date, default: Date.now },
  }],
},
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
export default User;
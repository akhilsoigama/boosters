const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    avatar: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10,15}$/, 'Invalid phone number'],
    },
    address: { type: String, default: '', trim: true },
    dob: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value < new Date();
        },
        message: 'Date of birth cannot be in the future.',
      },
    },
    github: {
      type: String,
      default: '',
      trim: true,
      match: [/^https?:\/\/(www\.)?github\.com\/.+$/, 'Invalid GitHub URL'],
    },
    youtube: {
      type: String,
      default: '',
      trim: true,
      match: [/^https?:\/\/(www\.)?youtube\.com\/.+$/, 'Invalid YouTube URL'],
    },
    linkedin: {
      type: String,
      default: '',
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.+$/, 'Invalid LinkedIn URL'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Unique index defined here
    },
  },
  { timestamps: true }
);

mongoose.connection.on('connected', async () => {
  try {
    const indexes = await mongoose.connection.db
      .collection('profiles')
      .indexes();
    if (indexes.some((index) => index.name === 'email_1')) {
      await mongoose.connection.db.collection('profiles').dropIndex('email_1');
      console.log('Dropped stale email_1 index from profiles collection');
    } else {
      console.log('No email_1 index found in profiles collection');
    }
  } catch (error) {
    console.error('Error checking/dropping email_1 index:', error);
  }
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

module.exports = Profile;
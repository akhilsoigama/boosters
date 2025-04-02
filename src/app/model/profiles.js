const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        name:{ type: String, trim: true },
        profilePicture: { type: String, default: '', trim: true },
        bio: { type: String, default: '', trim: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
        phoneNo: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true,
            match: [/^\d{10,15}$/, "Invalid phone number"]
        },
        address: { type: String, default: '', trim: true },
        dob: { 
            type: Date, 
            validate: {
                validator: function(value) {
                    return value < new Date(); 
                },
                message: "Date of birth cannot be in the future."
            }
        },
        github: { type: String, default: '', trim: true, match: [/^https?:\/\/(www\.)?github\.com\/.+$/, "Invalid GitHub URL"] },
        youtube: { type: String, default: '', trim: true, match: [/^https?:\/\/(www\.)?youtube\.com\/.+$/, "Invalid YouTube URL"] },
        linkedin: { type: String, default: '', trim: true, match: [/^https?:\/\/(www\.)?linkedin\.com\/.+$/, "Invalid LinkedIn URL"] },
        User_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: true } 
);

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

module.exports = Profile;

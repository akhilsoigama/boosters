const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    bio: {
        type: String,
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    dateOfBirth: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: '',
    },
    youTube: {
        type: String,
        default: '',
    },
    linkedIn: {
        type: String,
        default: '',
    },
    github: {
        type: String,
        default: '',
    },
}); 

const Profile = mongoose.models.profile || mongoose.model('profile', profileSchema);

module.exports= Profile;
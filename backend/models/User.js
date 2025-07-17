const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'organizer'],
        default: 'user'
    },

    // Profile information
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    university: { type: String, trim: true },
    major: { type: String, trim: true },
    yearOfStudy: { type: String, enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'PhD'] },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String, trim: true }],
    portfolioUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    profilePicture: { type: String, trim: true },

    // Hackathon-related fields
    readyHackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
    joinedHackathons: [{ 
        hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
        joinedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['active', 'completed', 'withdrawn'], default: 'active' }
    }],
    joinRequests: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        sentAt: { type: Date, default: Date.now },
        message: { type: String, maxlength: 200 }
    }],

    // Experience and preferences
    hackathonExperience: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    preferredTeamSize: { type: Number, min: 2, max: 10, default: 4 },
    availability: { type: String, enum: ['Weekends', 'Evenings', 'Full-time', 'Flexible'], default: 'Flexible' },
    interests: [{ type: String, trim: true }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

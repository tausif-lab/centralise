const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
     /*userType: { type: String, enum: ["university", "coaching"], required: true },*/
    collegeId: {
        type: String,
        required: true
        
    },
        
    user1Id:{
        type: String,
        required: true
       
    },
        
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    branch:{
        type: String,
        required: false
        
    },
        
    role: {
        type: String,
        enum: ['student', 'FacultyIncharge', 'admin'],
        default: 'student'
    },
    facultyInchargeType:{
      type: String,
       enum:['Hackathons','Sports','Workshops','Extracurricular Activity'], // Fixed typo: 'Hackthons' to 'Hackathons'
       required: function() {
        return this.role === 'FacultyIncharge';
        }
},
    phone: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    semester: {
        type: String,
        default: ''
    },
    cgpa: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    }, 
    github: {
        type: String,
        default: ''
    },
    skills: [{
        type: String
    }],

    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        this.updatedAt = Date.now();
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.updatedAt = Date.now();
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

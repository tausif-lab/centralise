
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT token - FIXED TYPOS
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id, 
           
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};


// authController.js - Update the register function

const register = async (req, res, next) => {
    try {
        const { fullName, email, collegeId, user1Id, password, confirmPassword, branch, role, facultyInchargeType } = req.body;

        // Validation - Make branch optional for admin role
       if (!fullName || !email || !password || !confirmPassword || !role || !collegeId || !user1Id) {
         return res.status(400).json({ message: 'All required fields must be filled' });
       }

       // Branch is required only for non-admin users
       if (role !== 'admin' && !branch) {
         return res.status(400).json({ message: 'Branch is required for non-admin users' });
       }

        // Validate facultyInchargeType only if role is FacultyIncharge
        if (role === 'FacultyIncharge' && !facultyInchargeType) {
           return res.status(400).json({ message: 'Faculty Incharge Type is required for Faculty role' });
        }

         // Check password match
         if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
          } 

        
        

        // ... existing validations remain the same ...

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const userData = {
            fullName,
            email,
            collegeId,
            user1Id,
            password,
            role,
            
            
        };
        
        // Only add branch if it's provided and not admin
        if (branch && role !== 'admin') {
            userData.branch = branch;
        }
        
        // Only add facultyInchargeType if role is FacultyIncharge
       if (role === 'FacultyIncharge' && facultyInchargeType) {
         userData.facultyInchargeType = facultyInchargeType;
        }

        
        const user = new User(userData);

        await user.save();
        console.log('User registered successfully ', user.email);

        // Generate JWT token
        const token = generateToken(user);
        
        // Send response with token and user details
        res.status(201).json({
            message: 'Registration successful with face enrollment',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                collegeId: user.collegeId,
                user1Id: user.user1Id,
                email: user.email,
                branch: user.branch,
                role: user.role,
                facultyInchargeType: user.facultyInchargeType
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password, role, facultyInchargeType } = req.body;
        console.log('Login attempt:', email, role);

        // Validation - Make facultyInchargeType optional for students
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required' });
        }

        // Validate facultyInchargeType only if role is FacultyIncharge
        if (role === 'FacultyIncharge' && !facultyInchargeType) {
            return res.status(400).json({ message: 'Faculty Incharge Type is required for Faculty role' });
        }

        // Find user by email and role
        const user = await User.findOne({ email, role });
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // For Faculty Incharge, verify facultyInchargeType matches
        if (role === 'FacultyIncharge') {
            if (user.facultyInchargeType !== facultyInchargeType) {
                console.log('Faculty Incharge Type mismatch');
                return res.status(401).json({ message: 'Invalid Faculty Incharge Type' });
            }
        }

        // Generate JWT token
        const token = generateToken(user);

        // Generate redirectUrl based on role
        let redirectUrl;
        if (role === 'student') {
            redirectUrl = `/StudentDashboard?collegeId=${user.collegeId}&userId=${user._id}&branch=${user.branch}`;
        } else if (role === 'FacultyIncharge') {
            redirectUrl = `/teacher-dashboard?collegeId=${user.collegeId}&userId=${user._id}&facultyInchargeType=${user.facultyInchargeType}`;
        }else if (role === 'admin'){
            redirectUrl = `/admin-dashboard?collegeId=${user.collegeId}&userId=${user._id}`;
        }
       
        console.log('Login successful for:', email, 'Redirecting to:', redirectUrl);

        res.json({
            message: 'Login successful',
            token,
            redirectUrl,
            user: {
                id: user._id,
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                collegeId: user.collegeId,
                user1Id: user.user1Id,
                branch: user.branch,
                ...(user.facultyInchargeType && { facultyInchargeType: user.facultyInchargeType })
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

// Get user profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // FIXED: was req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Profile error:', error);
        next(error);
    }
};

// Logout (client-side will handle token removal)
const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};


module.exports = {
    register,
    
    login,
    getProfile,
    
    logout
};


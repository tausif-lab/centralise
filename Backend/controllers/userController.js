const User = require('../models/User');

/*/ GET user by userId
const userProfile = async (req, res) => {
  try {
   /* const user = await User.findOne({ user1Id: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    *
   let user = await User.findById(req.params.userId);
    
    if (!user) {
      user = await User.findOne({ user1Id: req.params.userId });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't send password to frontend - ADD MISSING FIELDS
    const userResponse = {
      fullName: user.fullName,
      email: user.email,
      collegeId: user.collegeId,
      user1Id: user.user1Id,
      branch: user.branch,
      role: user.role,
      facultyInchargeType: user.facultyInchargeType,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      semester: user.semester,
      cgpa: user.cgpa,
      linkedin: user.linkedin,
      github: user.github,
      skills: user.skills,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};*/
const userProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Searching for user with identifier:', userId); // DEBUG LOG
    
    let user = await User.findById(userId);
    console.log('User found by _id:', user ? 'Yes' : 'No'); // DEBUG LOG
    
    if (!user) {
      user = await User.findOne({ user1Id: userId });
      console.log('User found by user1Id:', user ? 'Yes' : 'No'); // DEBUG LOG
    }
    
    if (!user) {
      console.log('User not found for identifier:', userId); // DEBUG LOG
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.user1Id, user.fullName); // DEBUG LOG
    
    // Don't send password to frontend - ADD MISSING FIELDS
    const userResponse = {
      _id: user._id,  // ADD THIS
      fullName: user.fullName,
      email: user.email,
      collegeId: user.collegeId,
      user1Id: user.user1Id,
      branch: user.branch,
      role: user.role,
      facultyInchargeType: user.facultyInchargeType,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      semester: user.semester,
      cgpa: user.cgpa,
      linkedin: user.linkedin,
      github: user.github,
      skills: user.skills,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
    
    res.json(userResponse);
  } catch (error) {
    console.error('Error in userProfile:', error); // DEBUG LOG
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// UPDATE user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // If fullName is being updated, reconstruct it from firstName and lastName
    if (updateData.firstName && updateData.lastName) {
      updateData.fullName = `${updateData.firstName} ${updateData.lastName}`;
      delete updateData.firstName;
      delete updateData.lastName;
    }

    /*const user = await User.findOneAndUpdate(
      { user1Id: userId },
      { 
        $set: {
          ...updateData,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );*/
    // Try updating by _id first, then fallback to user1Id
    let user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: {
          ...updateData,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      user = await User.findOneAndUpdate(
        { user1Id: userId },
        { 
          $set: {
            ...updateData,
            updatedAt: Date.now()
          }
        },
        { new: true, runValidators: true }
      );
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return updated user without password
    const userResponse = {
      fullName: user.fullName,
      email: user.email,
      collegeId: user.collegeId,
      user1Id: user.user1Id,
      branch: user.branch,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      semester: user.semester,
      cgpa: user.cgpa,
      linkedin: user.linkedin,
      github: user.github,
      skills: user.skills,
      isActive: user.isActive,
      updatedAt: user.updatedAt
    };
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// ADD THIS NEW FUNCTION
const checkUserExists = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Try to find by _id
    const userById = await User.findById(userId).catch(() => null);
    
    // Try to find by user1Id
    const userByUser1Id = await User.findOne({ user1Id: userId });
    
    // Get all users with similar user1Id (for debugging)
    const similarUsers = await User.find({ 
      user1Id: { $regex: userId.substring(0, 3), $options: 'i' } 
    }).select('user1Id fullName role');
    
    res.json({
      searchedId: userId,
      foundById: !!userById,
      foundByUser1Id: !!userByUser1Id,
      similarUsers: similarUsers,
      totalUsersInDB: await User.countDocuments()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  userProfile,
  updateUserProfile,
  checkUserExists  // EXPORT THIS
};


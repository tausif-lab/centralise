const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Activity = require('../models/Activity');
const PDFDocument = require('pdfkit');

// Get portfolio data with user info and verified activities
// Update getPortfolioData function
/*exports.getPortfolioData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data (exclude user1Id and password)
    const user = await User.findById(userId).select('-user1Id -password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get portfolio
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId });
      await portfolio.save();
    }

    // Get verified activities with populated faculty info
    const activities = await Activity.find({ 
      userId, 
      verificationStatus: 'approved'  // Changed from 'verified' to 'approved'
    }).populate('approvedByFacultyId', 'fullName user1Id');

    // Organize activities by correct categories
    const organizedActivities = {
      internships: activities.filter(a => a.category === 'internships'),
      certificates: activities.filter(a => a.category === 'workshops'),
      accomplishments: activities.filter(a => 
        ['hackathons', 'sports', 'achievements'].includes(a.category)
      ),
    };

    res.json({
      user,
      portfolio,
      activities: organizedActivities,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio data', error: error.message });
  }
};*/

// Update getPortfolioData function
exports.getPortfolioData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching portfolio for userId:', userId);

    // Find user by user1Id or _id
    let user = await User.findById(userId).select('-password');
    if (!user) {
      user = await User.findOne({ user1Id: userId }).select('-password');
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.fullName, 'MongoDB _id:', user._id);

    // Get portfolio using MongoDB _id
    let portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: user._id });
      await portfolio.save();
    }

    // Get verified activities using user1Id (matching Activity schema)
    const activities = await Activity.find({ 
      user1Id: user.user1Id,  // Changed from userId to user1Id
      verificationStatus: 'approved'
    }).populate('approvedByFacultyId', 'fullName user1Id');

    console.log('Activities found:', activities.length);

    // Organize activities by correct categories
    const organizedActivities = {
      internships: activities.filter(a => a.category === 'internships'),
      workshops: activities.filter(a => a.category === 'workshops'),
      hackathons: activities.filter(a => a.category === 'hackathons'),
      sports: activities.filter(a => a.category === 'sports'),
      achievements: activities.filter(a => a.category === 'achievements')
    };

    res.json({
      user,
      portfolio,
      activities: organizedActivities,
    });
  } catch (error) {
    console.error('Error in getPortfolioData:', error);
    res.status(500).json({ message: 'Error fetching portfolio data', error: error.message });
  }
};

// Add project to portfolio
exports.addProject = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, link, technologies, startDate, endDate } = req.body;

    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId });
    }

    portfolio.projects.push({
      title,
      description,
      link,
      technologies,
      startDate,
      endDate,
    });

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error adding project', error: error.message });
  }
};

// Delete project from portfolio
exports.deleteProject = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.projects.id(projectId).deleteOne();
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

// Update portfolio bio
exports.updatePortfolioBio = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileSummary } = req.body;

    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId });
    }

    portfolio.profileSummary = profileSummary;
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bio', error: error.message });
  }
};

// Generate PDF Portfolio
exports.generatePDF = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Generating PDF for userId:', userId);

    // Find user by user1Id or _id
    let user = await User.findById(userId).select('-password');
    if (!user) {
      user = await User.findOne({ user1Id: userId }).select('-password');
    }
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.fullName);

    // Get portfolio using MongoDB _id
    const portfolio = await Portfolio.findOne({ userId: user._id });
    console.log('Portfolio found:', portfolio ? 'Yes' : 'No');
    
    // Get activities using user1Id (matching Activity schema)
    const activities = await Activity.find({ 
      user1Id: user.user1Id,  // Changed from userId to user1Id
      verificationStatus: 'approved' 
    }).populate('approvedByFacultyId', 'fullName user1Id');
    
    console.log('Activities found:', activities.length);

    const organizedActivities = {
      internships: activities.filter(a => a.category === 'internships'),
      workshops: activities.filter(a => a.category === 'workshops'),
      hackathons: activities.filter(a => a.category === 'hackathons'),
      sports: activities.filter(a => a.category === 'sports'),
      achievements: activities.filter(a => a.category === 'achievements')
    };

    // Rest of the PDF generation code remains the same...
    // (Keep all the existing PDF generation code)

    // Create PDF
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    });
    
    // Set headers BEFORE piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${user.fullName.replace(/\s+/g, '_')}_portfolio.pdf`);

    // Handle errors on both doc and res streams
    doc.on('error', (err) => {
      console.error('PDF Document Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error generating PDF', error: err.message });
      }
      doc.destroy();
    });

    res.on('error', (err) => {
      console.error('Response Stream Error:', err);
      doc.destroy();
    });

    doc.pipe(res);

    // Header - User Information
    doc.fontSize(24).font('Courier-Bold').text(user.fullName.toUpperCase(), { align: 'center' });
    doc.moveDown(0.3);
    
    if (user.branch) {
      doc.fontSize(12).font('Courier').text(user.branch, { align: 'center' });
    }
    
    // Contact Info
    doc.fontSize(10).font('Courier');
    if (user.email) doc.text(`Email: ${user.email}`, { align: 'center' });
    if (user.phone) doc.text(`Phone: ${user.phone}`, { align: 'center' });
    if (user.location) doc.text(`Location: ${user.location}`, { align: 'center' });
    /*if (user.linkedin) doc.text(`LinkedIn: ${user.linkedin}`, { align: 'center' });
    if (user.github) doc.text(`GitHub: ${user.github}`, { align: 'center' });*/
    if (user.linkedin) {
  const linkedinUrl = user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`;
  doc.fillColor('blue')
    .text('LinkedIn: ', { continued: true, align: 'center', underline: false })
    .text(linkedinUrl, { link: linkedinUrl, underline: true, align: 'center' })
    .fillColor('black');
}

if (user.github) {
  const githubUrl = user.github.startsWith('http') ? user.github : `https://${user.github}`;
  doc.fillColor('blue')
    .text('GitHub: ', { continued: true, align: 'center', underline: false })
    .text(githubUrl, { link: githubUrl, underline: true, align: 'center' })
    .fillColor('black');
}
    
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Professional Summary
    if (portfolio?.profileSummary) {
      doc.fontSize(14).font('Courier-Bold').text('PROFESSIONAL SUMMARY', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Courier').text(portfolio.profileSummary, { align: 'justify' });
      doc.moveDown(1);
    }

    // Academic Information
    doc.fontSize(14).font('Courier-Bold').text('ACADEMIC INFORMATION', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Courier');
    if (user.collegeId) doc.text(`University: ${user.collegeId}`);
    if (user.semester) doc.text(`Current Semester: ${user.semester}`);
    if (user.cgpa) doc.text(`CGPA: ${user.cgpa}`);
    doc.moveDown(1);

    // Skills
    if (user.skills && user.skills.length > 0) {
      doc.fontSize(14).font('Courier-Bold').text('TECHNICAL SKILLS', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Courier').text(user.skills.join(' | '));
      doc.moveDown(1);
    }
    
    // Internships & Training
    if (organizedActivities.internships.length > 0) {
      doc.fontSize(14).font('Courier-Bold').text('INTERNSHIPS & TRAINING', { underline: true });
      doc.moveDown(0.5);
      
      organizedActivities.internships.forEach((activity, index) => {
        // Check if we need a new page
        if (doc.y > 700) {
          doc.addPage();
        }
        
        doc.fontSize(11).font('Courier-Bold').text(activity.title || 'Untitled');
        doc.fontSize(10).font('Courier');
        
        if (activity.company) doc.text(`Company: ${activity.company}`);
        if (activity.location) doc.text(`Location: ${activity.location}`);
        
        if (activity.date) {
          const startDate = new Date(activity.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          const endDate = activity.endDate ? new Date(activity.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
          doc.text(`Duration: ${startDate} - ${endDate}`);
        }
        
        if (activity.description) {
          doc.text(`Description: ${activity.description}`);
        }
        
        // Verification Info
        if (activity.approvedByFacultyId) {
          doc.font('Courier-Oblique').fontSize(9);
          doc.text(`Verified by: ${activity.approvedByFacultyId.fullName || 'N/A'} (ID: ${activity.approvedByFacultyId.user1Id || 'N/A'})`, { align: 'right' });
        }
        
        /* {
          doc.fontSize(9).font('Courier').text(`Certificate: ${activity.certificateUrl}`);
        }*/
       if (activity.certificateUrl) {
  const certUrl = activity.certificateUrl.startsWith('http') 
    ? activity.certificateUrl 
    : `http://localhost:3001${activity.certificateUrl}`;
  doc.fontSize(9).font('Courier')
    .fillColor('blue')
    .text(`Certificate: `, { continued: true, underline: false })
    .text(certUrl, { link: certUrl, underline: true })
    .fillColor('black');
}
        
        doc.moveDown(0.7);
      });
      doc.moveDown(0.5);
    }

    // Certificates & Workshops
    if (organizedActivities.workshops.length > 0) {
      if (doc.y > 700) doc.addPage();
      
      doc.fontSize(14).font('Courier-Bold').text('CERTIFICATES & WORKSHOPS', { underline: true });
      doc.moveDown(0.5);
      
      organizedActivities.workshops.forEach(activity => {
        if (doc.y > 700) doc.addPage();
        
        doc.fontSize(11).font('Courier-Bold').text(activity.title || 'Untitled');
        doc.fontSize(10).font('Courier');
        
        if (activity.location) doc.text(`Organization: ${activity.location}`);
        
        if (activity.date) {
          const activityDate = new Date(activity.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          doc.text(`Date: ${activityDate}`);
        }
        
        if (activity.description) {
          doc.text(`Description: ${activity.description}`);
        }
        
        if (activity.approvedByFacultyId) {
          doc.font('Courier-Oblique').fontSize(9);
          doc.text(`Verified by: ${activity.approvedByFacultyId.fullName || 'N/A'} (ID: ${activity.approvedByFacultyId.user1Id || 'N/A'})`, { align: 'right' });
        }
        
        /*if (activity.certificateUrl) {
          doc.fontSize(9).font('Courier').text(`Certificate: ${activity.certificateUrl}`);
        }*/
        if (activity.certificateUrl) {
  const certUrl = activity.certificateUrl.startsWith('http') 
    ? activity.certificateUrl 
    : `http://localhost:3001${activity.certificateUrl}`;
  doc.fontSize(9).font('Courier')
    .fillColor('blue')
    .text(`Certificate: `, { continued: true, underline: false })
    .text(certUrl, { link: certUrl, underline: true })
    .fillColor('black');
}
        doc.moveDown(0.7);
      });
      doc.moveDown(0.5);
    }

    // Hackathons
    if (organizedActivities.hackathons.length > 0) {
      if (doc.y > 700) doc.addPage();
      
      doc.fontSize(14).font('Courier-Bold').text('HACKATHONS', { underline: true });
      doc.moveDown(0.5);
      
      organizedActivities.hackathons.forEach(activity => {
        if (doc.y > 700) doc.addPage();
        
        doc.fontSize(11).font('Courier-Bold').text(activity.title || 'Untitled');
        doc.fontSize(10).font('Courier');
        
        if (activity.event) doc.text(`Event: ${activity.event}`);
        if (activity.location) doc.text(`Location: ${activity.location}`);
        
        if (activity.date) {
          const activityDate = new Date(activity.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          doc.text(`Date: ${activityDate}`);
        }
        
        if (activity.description) {
          doc.text(`Description: ${activity.description}`);
        }
        
        if (activity.approvedByFacultyId) {
          doc.font('Courier-Oblique').fontSize(9);
          doc.text(`Verified by: ${activity.approvedByFacultyId.fullName || 'N/A'} (ID: ${activity.approvedByFacultyId.user1Id || 'N/A'})`, { align: 'right' });
        }
        
        if (activity.certificateUrl) {
          doc.fontSize(9).font('Courier').text(`Certificate: ${activity.certificateUrl}`);
        }
        
        doc.moveDown(0.7);
      });
      doc.moveDown(0.5);
    }

    // Sports
    if (organizedActivities.sports.length > 0) {
      if (doc.y > 700) doc.addPage();
      
      doc.fontSize(14).font('Courier-Bold').text('SPORTS', { underline: true });
      doc.moveDown(0.5);
      
      organizedActivities.sports.forEach(activity => {
        if (doc.y > 700) doc.addPage();
        
        doc.fontSize(11).font('Courier-Bold').text(activity.title || 'Untitled');
        doc.fontSize(10).font('Courier');
        
        if (activity.event) doc.text(`Event: ${activity.event}`);
        if (activity.location) doc.text(`Location: ${activity.location}`);
        
        if (activity.date) {
          const activityDate = new Date(activity.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          doc.text(`Date: ${activityDate}`);
        }
        
        if (activity.description) {
          doc.text(`Description: ${activity.description}`);
        }
        
        if (activity.approvedByFacultyId) {
          doc.font('Courier-Oblique').fontSize(9);
          doc.text(`Verified by: ${activity.approvedByFacultyId.fullName || 'N/A'} (ID: ${activity.approvedByFacultyId.user1Id || 'N/A'})`, { align: 'right' });
        }
        
        if (activity.certificateUrl) {
          doc.fontSize(9).font('Courier').text(`Certificate: ${activity.certificateUrl}`);
        }
        
        doc.moveDown(0.7);
      });
      doc.moveDown(0.5);
    }

    // Achievements
    if (organizedActivities.achievements.length > 0) {
      if (doc.y > 700) doc.addPage();
      
      doc.fontSize(14).font('Courier-Bold').text('ACHIEVEMENTS', { underline: true });
      doc.moveDown(0.5);
      
      organizedActivities.achievements.forEach(activity => {
        if (doc.y > 700) doc.addPage();
        
        doc.fontSize(11).font('Courier-Bold').text(activity.title || 'Untitled');
        doc.fontSize(10).font('Courier');
        
        if (activity.event) doc.text(`Event: ${activity.event}`);
        if (activity.location) doc.text(`Location: ${activity.location}`);
        
        if (activity.date) {
          const activityDate = new Date(activity.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          doc.text(`Date: ${activityDate}`);
        }
        
        if (activity.description) {
          doc.text(`Description: ${activity.description}`);
        }
        
        if (activity.approvedByFacultyId) {
          doc.font('Courier-Oblique').fontSize(9);
          doc.text(`Verified by: ${activity.approvedByFacultyId.fullName || 'N/A'} (ID: ${activity.approvedByFacultyId.user1Id || 'N/A'})`, { align: 'right' });
        }
        
        if (activity.certificateUrl) {
          doc.fontSize(9).font('Courier').text(`Certificate: ${activity.certificateUrl}`);
        }
        
        doc.moveDown(0.7);
      });
      doc.moveDown(0.5);
    }

    // Projects
    if (portfolio?.projects && portfolio.projects.length > 0) {
      if (doc.y > 700) doc.addPage();
      
      doc.fontSize(14).font('Courier-Bold').text('PROJECTS', { underline: true });
      doc.moveDown(0.5);
      
      portfolio.projects.forEach(project => {
        if (doc.y > 700) doc.addPage();
        
        doc.fontSize(11).font('Courier-Bold').text(project.title);
        doc.fontSize(10).font('Courier');
        
        doc.text(project.description, { align: 'justify' });
        
        if (project.link) {
          doc.text(`Project Link: ${project.link}`);
        }
        
        if (project.technologies && project.technologies.length > 0) {
          doc.text(`Technologies: ${project.technologies.join(', ')}`);
        }
        
        if (project.startDate) {
          const start = new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          const end = project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ongoing';
          doc.text(`Duration: ${start} - ${end}`);
        }
        
        doc.moveDown(0.7);
      });
    }

    doc.end();
    
    console.log('PDF generation completed'); // Debug log
    
  } catch (error) {
    console.error('PDF Generation Error:', error); // Debug log
    
    // Only send error response if response hasn't started
    if (!res.writableEnded && !res.headersSent) {
      res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
  }
};

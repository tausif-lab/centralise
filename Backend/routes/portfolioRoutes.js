const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Get portfolio data
router.get('/:userId', portfolioController.getPortfolioData);

// Add project
router.post('/:userId/projects', portfolioController.addProject);

// Delete project
router.delete('/:userId/projects/:projectId', portfolioController.deleteProject);

// Update bio
router.put('/:userId/bio', portfolioController.updatePortfolioBio);

// Download PDF
router.get('/:userId/pdf', portfolioController.generatePDF);

module.exports = router;

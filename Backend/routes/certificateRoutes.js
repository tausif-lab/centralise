const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');

router.post('/:userId/submit', authenticateToken, certificateController.submitCertificate);
router.get('/student/:userId', authenticateToken, certificateController.getStudentCertificates);
router.get('/faculty/:facultyId/pending', authenticateToken, certificateController.getPendingCertificates);
router.post('/:certificateId/approve', authenticateToken, certificateController.approveCertificate);
router.post('/:certificateId/reject', authenticateToken, certificateController.rejectCertificate);
router.get('/:certificateId/verify', certificateController.verifyCertificate);
router.get('/stats/:facultyId', authenticateToken, certificateController.getCertificateStats);

module.exports = router;

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.signup);
router.get('/setup/:username', authController.setup2FA);
router.post('/verify/:username', authController.verifyOTP);
router.put('/skip/:username', authController.skip);
router.post('/sign', authController.login);
router.get('/', authController.logout);
 
module.exports = router;

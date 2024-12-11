const express = require('express');
const router = express.Router();
const { registerUser, loginUser, resetPassword, getUserProfile, updateUserProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.get('/user/:userId', getUserProfile);
router.put('/user/:userId', updateUserProfile);


router.get('/', (req, res) => {
  res.send('hello world')
})

module.exports = router;

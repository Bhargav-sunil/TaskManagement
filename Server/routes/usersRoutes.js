const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getAllUsers);

router.post('/', adminAuth, createUser);
router.put('/:id', adminAuth, updateUser);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;

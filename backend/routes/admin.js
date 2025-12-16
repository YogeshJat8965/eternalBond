const express = require('express');
const {
  adminLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  getAllContacts,
  updateContactStatus,
  getAllInterests,
  getDashboardStats
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/admin');

const router = express.Router();

// Public route
router.post('/login', adminLogin);

// Protected routes - require admin authentication
router.get('/users', adminProtect, getAllUsers);
router.get('/users/:id', adminProtect, getUserById);
router.put('/users/:id', adminProtect, updateUser);
router.delete('/users/:id', adminProtect, deleteUser); // Super-admin only (checked in controller)
router.put('/users/:id/restore', adminProtect, restoreUser); // Super-admin only (checked in controller)

router.get('/contacts', adminProtect, getAllContacts);
router.put('/contacts/:id', adminProtect, updateContactStatus);

router.get('/interests', adminProtect, getAllInterests);

router.get('/stats', adminProtect, getDashboardStats);

module.exports = router;

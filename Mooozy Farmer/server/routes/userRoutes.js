const express = require('express');
const { registerController, loginController, getNameController, detailsController } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Create a router object
const router = express.Router();

// Routes
// REGISTER - POST
router.post("/register", registerController);

// LOGIN - POST
router.post("/login", loginController);

// Fetch user's name - GET
router.get('/user/name', verifyToken, getNameController);

// Route to save additional user details - POST
router.post('/details', verifyToken, detailsController);

// Export the router
module.exports = router;

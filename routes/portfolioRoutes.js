const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/isAdmin'); 
const { isAuthenticated } = require('../middleware/auth');
const portfolioController = require('../controllers/portfolioController');
const upload = require('../middleware/upload');

// Routes for portfolio items
router.post('/', isAuthenticated, upload.array('images'), portfolioController.createItem); // Create portfolio item
router.get('/', isAuthenticated, portfolioController.getItems); // Get all portfolio items
router.get('/:id', isAuthenticated, isAdmin, portfolioController.getByIdItem); // Get portfolio by id
router.put('/:id', isAuthenticated, isAdmin, upload.array('images'), portfolioController.updateItem); // Update portfolio item
router.delete('/:id', isAuthenticated, isAdmin, portfolioController.deleteItem); // Delete portfolio item

module.exports = router;

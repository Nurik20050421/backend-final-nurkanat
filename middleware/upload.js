const multer = require('multer');
const path = require('path');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // Store files in the 'images' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Configure multer
const upload = multer({ storage, fileFilter });

module.exports = upload;

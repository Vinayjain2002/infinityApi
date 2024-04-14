const multer = require("multer"); // Assuming installation is correct

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Choose the appropriate file path based on your project structure (see explanation above)
    cb(null, 'public/temp'); // Example using relative path from root
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

module.exports = { upload };

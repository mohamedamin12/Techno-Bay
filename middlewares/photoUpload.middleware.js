const multer = require("multer");
const path = require("path");

//* Photo Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

//* upload photo
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1, 
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true); 
    } else {
      cb({ message: "Unsupported file format" }, false); 
    }
  },
});


module.exports = upload;
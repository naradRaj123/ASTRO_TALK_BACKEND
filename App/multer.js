const multer = require('multer');

// Define storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/'); // Directory to save the files
    },
    filename: (req, file, cb) => {
        const suffix = Date.now();
        cb(null, suffix + '-'+file.originalname);
    },
});

// File validation
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
//         cb(null, true);
//     } else {
//         cb(new Error('Unsupported file format'), false);
//     }
// };

const upload = multer({ storage});

module.exports = upload;
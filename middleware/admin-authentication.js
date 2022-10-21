var session = require('express-session');
const multer = require('multer');

module.exports.authentication = (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});


module.exports.StorageCurousel = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/curousel");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});
const session = require('express-session');

function userAuthentication(req, res, next) {
    session = req.session;
    if (req.session.user) {

        next();
    } else {
        res.render('user/user-login', { user: true })
    }
};


module.exports = userAuthentication;



module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.status.redirect('/login');
    }
    next();
}

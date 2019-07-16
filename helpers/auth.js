//provides access control
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/api/users/login');
    }
  }
};

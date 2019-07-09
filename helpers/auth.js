//provides access control
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.ensureAuthenticated) {
      return next();
    } else {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/users/signin');
    }
  }
};

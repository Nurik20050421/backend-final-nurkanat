exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    } else {
      req.flash('error', 'You are not authenticated.');
      return res.redirect('/error'); 

    }
};
  
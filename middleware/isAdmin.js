exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    req.flash('error', 'Access Denied.');
    return res.redirect('/error'); 
  }
}

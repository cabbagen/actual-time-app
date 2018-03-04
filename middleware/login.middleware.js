
module.exports = function() {
  return function(req, res, next) {
    const { url, method } = req;
    if (method === 'GET' && /^\/admin/.test(url) && !req.session.userId) {
      res.redirect('/index');
      return;
    }
    next();
  }
}
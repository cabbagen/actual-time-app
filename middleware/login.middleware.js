
module.exports = function() {
  return function(req, res, next) {
    const { url, method } = req;

    if (method === 'GET' && /^\/admin/.test(url) && !req.session.userId) {
      return res.redirect('/index');
    }
    next();
  }
}
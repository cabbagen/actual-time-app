/**
 * restful api auth 
 */
const tokenProvider = require('../providers/token.provider.js');

module.exports = function() {
  return function(req, res, next) {
    const { token, appName } = req.headers;
    
    if (typeof token === 'undefined' || typeof appName === 'undefined') {
      res.redirect('/index');
      return;
    }

    const tokenInfo = tokenProvider.validateToken(appName, token);    
    
    if (tokenInfo.state !== 0) {
      return res.json({ tokenInfo });
    }
    next();
  }
}

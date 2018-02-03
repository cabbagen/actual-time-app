const session = require('express-session');

const sess = {
  secret: 'keyboard cat',
  cookie: {},
};

module.exports = function(app) {
  if (app.get('env' === 'prodution')) {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
  }
  app.use(session(sess));

  return function(req, res, next) {
    next();
  }
};

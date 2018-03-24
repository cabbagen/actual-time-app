const session = require('express-session');

const sess = {
  secret: 'keyboard',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
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

const BaseController = require('./base.controller.js');
const captchaProvider = require('../providers/captcha.provider.js');
const cryptoProvider = require('../providers/crypto.provider.js');
const utilsProvider = require('../providers/utils.provider.js');
const UsersModel = require('../model/users.model.js');

class IndexController extends BaseController {

  static init() {
    return new IndexController();
  }

  constructor(prop) {
    super(prop);
    this.projects = [
      { name: '实时通讯', link: 'http://localhost:4200/chat' },
      { name: '实时视频', link: '/video' },
      { name: '在线文档', link: '/document' },
    ];
  }

  renderIndex(req, res, next) {
    res.render('index/index', { projects: this.projects });
  }

  getCaptcha(req, res, next) {
    const captcha = captchaProvider.generateDefaultCaptcha();
    req.session.captcha = captcha.text;

    res.type('svg');
    res.status(200).send(captcha.data);
  }

  login(req, res, next) {
    const { username, password, validateImageText } = req.body;
    const sessionCaptcha = req.session.captcha;
    const isPassCheckValidateImageText = this.checkValidateImageText(sessionCaptcha, validateImageText);

    if (!isPassCheckValidateImageText) {
      res.json({ status: '500', data: null, msg: '验证码错误', type: 'captcha-error' });
      return;
    }

    const passwordHash = cryptoProvider.getSaledHashSync(password);

    UsersModel.findOne({ username }).exec()
      .then((data) => {
        if (cryptoProvider.compareSaledHashSync(password, passwordHash)) {
          req.session.userId = data._id;
          res.json({ status: 200, data, msg: 'ok', type: null });
        } else {
          res.json({ status: 500, data: null, msg: '输入密码错误', type: 'password-error' });
        }
      })
      .catch((error) => {
        res.json({ status: 500, msg: '数据库查询失败!', data: null, type: 'username-error' });
      });
  }

  checkValidateImageText(sessionCaptcha, validateImageText) {
    if (!validateImageText || validateImageText === '') {
      return false;
    }

    return sessionCaptcha === validateImageText;
  }

  renderRegister(req, res) {
    res.render('index/register');
  }

  renderChat(req, res) {
    res.render('chat/chat');
  }
}

module.exports = IndexController;

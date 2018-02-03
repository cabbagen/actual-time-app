const co = require('co');
const BaseController = require('./base.controller.js');
const captchaProvider = require('../providers/captcha.provider.js');


class IndexController extends BaseController {

  static init() {
    return new IndexController();
  }

  constructor(prop) {
    super(prop);
    this.projects = [
      { name: '实时通讯', link: '/chat' },
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
    const params = req.body;
    res.json({ status: 200, msg: 'ok', data: params });
  }
}

module.exports = IndexController;

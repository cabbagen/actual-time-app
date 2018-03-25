const BaseController = require('./base.controller.js');

class AdminController extends BaseController {

  static init() {
    return new AdminController();
  }

  constructor(prop) {
    super(prop);
    this.navItems = [
      
    ];
  }

  renderAdmin(req, res, next) {
    res.render('admin/admin');
  }
}

module.exports = AdminController;

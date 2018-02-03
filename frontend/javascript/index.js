
function LoginLayer() {
  this.name = '登录框';
}

LoginLayer.prototype = {
  constructor: LoginLayer,
  
  init: function() {
    this.showLayer().changeCaptchaImg();
  },

  showLayer: function() {
    var that = this;
    
    layui.use('layer', function() {
      var layer = layui.layer;
      $('.login').on('click', function() {
        $('.error', '#login-form').hide();
        layer.open({
          type: 1,
          title: that.name,
          content: $('#login-modal'),
          area: ['500px'],
          offset: '100px',
          btn: ['登录', '取消'],
          yes: function(index, layero) {
            var ispass = that._vilidateInfo();
            if (ispass) {
              that._loginForm();
            }
          },
        })
      });
    });

    return that;
  },

  _vilidateInfo: function() {
    var ispass = true;
    var $usernameField = $('input[name="username"]', $('#login-form'));
    var $passwordField = $('input[name="password"]', $('#login-form'));
    var $captchaField = $('input[name=validateImageText]', $('#login-form'));

    // 用户名非空判断
    if ($usernameField.val() === '') {
      $('.username-error').text('请输入用户名').show();
      ispass = false;
    }

    // 密码非空判断
    if ($passwordField.val() === '') {
      $('.password-error').text('请输入密码').show();
      ispass = false;
    }

    // 验证码非空判断
    if ($captchaField.val() === '') {
      $('.captcha-error').text('请输入验证码').show();
      ispass = false;
    }

    return ispass;
  },

  _loginForm: function() {
    $.ajax({
      method: 'POST',
      url: '/login',
      data: $('#login-form').serialize(),
      dataType: 'json',
      success: function(data) {
        console.log('data', data);
      },
    })

    return this;
  },

  changeCaptchaImg: function() {
    $('.validateImage').on('click', function() {
      var originImgSource = $(this).attr('src');
      $(this).attr('src', originImgSource.split('?')[0] + '?' + Math.random());
    });

    return this;
  },
}

var loginLayer = new LoginLayer();

loginLayer.init();
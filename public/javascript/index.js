function LoginLayer(){this.name="登录框"}LoginLayer.prototype={constructor:LoginLayer,init:function(){this.showLayer().changeCaptchaImg()},showLayer:function(){var n=this;return layui.use("layer",function(){var o=layui.layer;$(".login").on("click",function(){$(".error","#login-form").hide(),o.open({type:1,title:n.name,content:$("#login-modal"),area:["500px"],offset:"100px",btn:["登录","取消"],yes:function(o,t){n._vilidateInfo()&&n._loginForm()}})})}),n},_vilidateInfo:function(){var n=!0,o=$('input[name="username"]',$("#login-form")),t=$('input[name="password"]',$("#login-form")),a=$("input[name=validateImageText]",$("#login-form"));return""===o.val()&&($(".username-error").text("请输入用户名").show(),n=!1),""===t.val()&&($(".password-error").text("请输入密码").show(),n=!1),""===a.val()&&($(".captcha-error").text("请输入验证码").show(),n=!1),n},_loginForm:function(){return $.ajax({method:"POST",url:"/login",data:$("#login-form").serialize(),dataType:"json",success:function(n){console.log("data",n)}}),this},changeCaptchaImg:function(){return $(".validateImage").on("click",function(){var n=$(this).attr("src");$(this).attr("src",n.split("?")[0]+"?"+Math.random())}),this}};var loginLayer=new LoginLayer;loginLayer.init();
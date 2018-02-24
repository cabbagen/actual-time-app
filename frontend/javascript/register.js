
$('button', '.footer').on('click', function() {
  // 必传项检测
  var $username = $('input[name="username"]', '.custom-row').val();
  var $password = $('input[name="password"]', '.custom-row').val();
  var $nickname = $('input[name="nickname"]', '.custom-row').val();
  var $email = $('input[name="email"]', '.custom-row').val();
  
  if ($username.trim() === '') {
    alert('请填写用户名');
    return;
  }

  if ($password.trim() === '') {
    alert('请填写密码');
    return;
  }

  if ($nickname.trim() === '') {
    alert('请填写用户昵称');
    return;
  }

  if ($email.trim() === '') {
    alert('请填写 email ');
    return;
  }

  $('.form').submit();
});

// 图片上传
$('.icon-upload').on('click', function() {
  $(this).next('input').click();
});

$('.icon-upload').next('input').on('change', function() {
  var file = $(this)[0].files[0];
  var formData = new FormData();

  formData.append('imgFile',file);

  $.ajax({
    url: '/uploadImg',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function (result) {
      if (result.status === 200) {
        $('.uploadAvator').val(result.data[0]);
      } else {
        alert(result.msg);
      }
    },
  });

});
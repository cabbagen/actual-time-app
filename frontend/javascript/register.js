
$('button', '.footer').on('click', function() {
  console.log('=====>')
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
      alert(result);
    },
  });

});
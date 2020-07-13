$(function () {
  // Ajax button click
  $('#sign-up').on('click', function () {
    $.ajax({
      url: '../../api/member/memberinfo.php',
      type: 'POST',
      data: {
        mailaddress: $('input[name=mall]').val(),
        password: $('input[name=pass]').val(),
        nickname: $('input[name=name]').val(),
        gender: $('[name=gender]:checked').val(),
        birthday:
          $('[name=year]').val() +
          '-' +
          $('[name=month]').val() +
          '-' +
          $('[name=day]').val()
      }
    })
      // Ajaxリクエストが成功した時発動
      .done(data => {
        $('.result').html(data)
        console.log(data)
        location.href = '../index.html'
      })
      // Ajaxリクエストが失敗した時発動
      .fail(data => {
        $('.result').html(data)
        console.log(data)
        if (!document.getElementById('mall').value) {
          $('mall-err-text').show()
        }

        if (!document.getElementById('pass').value) {
          $('pass-err-text').show()
        }

        if (!document.getElementById('name').value) {
          $('name-err-text').show()
        }
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always(data => {})
  })
})

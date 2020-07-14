$(function () {
  // Ajax button click

  $('#sign-up').on('click', function () {
    if (!$('input[name=mall]').val() || $('input[name=mall]').val() == '') {
      $('#mall-err').css('display', 'block')
    } else {
      $('#mall-err').css('display', 'none')
    }

    if (!$('input[name=pass]').val() || $('input[name=pass]').val() == '') {
      $('#pass-err').css('display', 'block')
    } else {
      $('#pass-err').css('display', 'none')
    }

    if (!$('input[name=name]').val() || $('input[name=name]').val() == '') {
      $('#name-err').css('display', 'block')
    } else {
      $('#name-err').css('display', 'none')
    }

    if (
      !$('[name=gender]:checked').val() ||
      $('[name=gender]:checked').val() == ''
    ) {
      $('#gender-err').css('display', 'block')
    } else {
      $('#gender-err').css('display', 'none')
    }
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
        $('#sign-up')
          .on('click', function () {
            console.log(data)
          })
          // Ajaxリクエストが成功・失敗どちらでも発動

          .always(data => {})
      })
  })
})

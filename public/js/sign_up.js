$(function () {
  // Ajax button click
  var reg = /^[a-z]{2}[0-9]*@mailg.denpa.ac.jp/

  $('#sign-up').on('click', function () {
    $(function () {
      var h = $(window).height()

      $('#loader-bg ,#loader')
        .height(h)
        .css('display', 'block')
    })

    if (
      !$('input[name=mail]').val() ||
      $('input[name=mail]').val() == '' ||
      !reg.test($('input[name=mail]').val())
    ) {
      $('#mail-err').css('display', 'block')
    } else {
      $('#mail-err').css('display', 'none')
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

    if (
      $('[id=year]').val() == 0 ||
      $('[id=month]').val() == 0 ||
      $('[id=date]').val() == 0
    ) {
      $('#birthday-err').css('display', 'block')
    } else {
      $('#birthday-err').css('display', 'none')
    }

    $.ajax({
      url: '../../../api/member/memberinfo.php',
      type: 'POST',
      data: {
        mailaddress: $('input[name=mail]').val(),
        password: $('input[name=pass]').val(),
        nickname: $('input[name=name]').val(),
        gender: $('[name=gender]:checked').val(),
        birthday:
          $('[id=year]').val() +
          '-' +
          $('[id=month]').val() +
          '-' +
          $('[id=day]').val()
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
        $('#loader-bg').css('display', 'none')

        // .always(data => {})
      })
  })
})

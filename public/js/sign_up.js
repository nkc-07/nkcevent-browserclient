$(function () {
  // Ajax button click
  $('#ajax').on('click', function () {
    $.ajax({
      url: '../../api/member/memberinfo.php',
      type: 'POST',
      data: {
        mailaddress: '2gaiji810@denpa.ac.jp',
        password: 'P@ssw0rd',
        nickname: 'isao',
        gender: 1,
        birthday: '1949-08-15'
      }
    })
      // Ajaxリクエストが成功した時発動
      .done(data => {
        $('.result').html(data)
        console.log(data)
      })
      // Ajaxリクエストが失敗した時発動
      .fail(data => {
        $('.result').html(data)
        console.log(data)
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always(data => {})
  })
})

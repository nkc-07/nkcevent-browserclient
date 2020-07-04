// ログイン処理
$(function() {
    $('input').on('keydown', function(e) {
        if (e.which == 13) {
            getLogin(
                $('#exampleInputEmail1').val(),
                $('#exampleInputPassword1').val()
            )
        }
    })
    $('.login-button').on('click', function() {
        getLogin(
            $('#exampleInputEmail1').val(),
            $('#exampleInputPassword1').val()
        )
    });
});


//ログイン処理
function getLogin(userID, password) {
    $.ajax({
            url: '../../api/member/login.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'mailaddress': userID,
                'password': password,
            }
        })
        .done(function(response) {
            console.log('通信成功PostMembrparticipation');
            console.log(response);
            if (response) { console.log('ログイン成功') }
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
}
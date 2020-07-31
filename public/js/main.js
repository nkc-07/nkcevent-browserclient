let loginInfo = {
    userId: undefined,
    password: undefined
};

// formのイベント
$(function() {
    $('input').on('keydown', function(e) {
        if (e.which == 13) {
            getLogin();
        }
    })
    $('.login-button').on('click', function() {
        getLogin();
    });
});

// ログイン処理
function getLogin() {
    $('.login-button').prop('disabled', true);
    $('.login-err').show();
    $('.login-button .login-text').hide();

    loginInfo['userId'] = $('#exampleInputEmail1').val()
    loginInfo['password'] = $('#exampleInputPassword1').val()

    $.ajax({
            url: '/api/member/login.php', //送信先
            type: 'POST', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'mailaddress': loginInfo['userId'],
                'password': loginInfo['password'],
            }
        })
        .done(function(response) {
            if (response['data']['success']) {
                localStorage.setItem('token', response['data']['token']);
                window.location.href = "/public/html/mypage/";
            } else {
                $('.login-button').prop('disabled', false);
                $('.loading-icon').hide();
                $('.login-button .login-text').show();
                $('.login-err-text').show();
            }
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
            $('.login-button').prop('disabled', false);
            $('.loading-icon').hide();
            $('.login-button .login-text').show();
            $('.login-err-text').show();
        })
}
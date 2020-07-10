let eventInfo = {
    "eventid": 1,
};

// formのイベント
$(function() {
/*    $('input').on('keydown', function(e) {
        if (e.which == 13) {
            getLogin();
        }
    })*/
    $("button").on('click', function() {
        console.log("run");
        geteventdetail();
    });

});

// 取得処理
function geteventdetail(){
    $.ajax({
        url: '../../../api/event/eventinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'event_id': eventInfo['eventid']
        }
    })
    .done(function(response) {
        console.log(response);
    })
    .fail(function(response) {
        console.log(response);
    })
}


/*
function getLogin() {
    $('.login-button').prop('disabled', true);
    $('.login-err').show();
    $('.login-button .login-text').hide();

    loginInfo['userId'] = $('#exampleInputEmail1').val()
    loginInfo['password'] = $('#exampleInputPassword1').val()

    //GET
    $.ajax({
        url: '../../api/member/login.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'mailaddress': loginInfo['userId'],
            'password': loginInfo['password'],
        }
    })
    .done(function(response) {
        console.log(response);
        if (response['data'] == 1) {
            localStorage.setItem('logininfo', JSON.stringify(loginInfo));
            window.location.href = "./mypage/";
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
    })
    //POST
    $.ajax({
        url: '../../api/member/login.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'mailaddress': loginInfo['userId'],
            'password': loginInfo['password'],
        }
    })
    .done(function(response) {
        console.log(response);
        if (response['data'] == 1) {
            localStorage.setItem('logininfo', JSON.stringify(loginInfo));
            window.location.href = "./mypage/";
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
    })
    //PUT

    $.ajax({
            url: '../../api/member/login.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'mailaddress': loginInfo['userId'],
                'password': loginInfo['password'],
            }
        })
        .done(function(response) {
            console.log(response);
            if (response['data'] == 1) {
                localStorage.setItem('logininfo', JSON.stringify(loginInfo));
                window.location.href = "./mypage/";
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
        })
}
*/
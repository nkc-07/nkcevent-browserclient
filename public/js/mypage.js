$.ajax({
        url: '/api/member/memberinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            token: localStorage.getItem('token')
        }
    })
    .done(function(response) {
        let memberInfo = response['data']['info'];
        let memberTag = response['data']['tag'];

        let birtday = memberInfo['birthday'].split('-');
        $('.user-icon').attr('src', `/public/image/svg/${memberInfo['icon']}`);
        $('.nickname').val(memberInfo['nickname']);
        $('.mailaddress').val(memberInfo['mailaddress']);
        $('.target-year').text(birtday[0]);
        $('.target-year').val(birtday[0]);
        $('.target-month').text(birtday[1]);
        $('.target-month').val(birtday[1]);
        $('.target-date').text(birtday[2]);
        $('.target-date').val(birtday[2]);
        $(`input[value=${memberInfo['gender']}]`).prop('checked', true);
    })
    .fail(function(response) {})
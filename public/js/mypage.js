let sendMemberInfo;

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

        /* ユーザのステータスを変更するために使用 */
        sendMemberInfo = memberInfo;
        console.log(sendMemberInfo)

        let birtday = memberInfo['birthday'].split('-');
        $('.user-icon').attr('src', memberInfo['icon']);
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
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })

$('.change-button').click(function(e) {
    sendMemberInfo['icon'] = $('.user-icon').attr('src');
    sendMemberInfo['nickname'] = $('.nickname').val();
    sendMemberInfo['mailaddress'] = $('.mailaddress').val();
    sendMemberInfo['birthday'] = $('.target-year').val() + '-' +
        $('.target-month').val() + '-' +
        $('.target-date').val();
    sendMemberInfo['gender'] = $('[name=gender]:checked')[0].value;

    $.ajax({
        url: '/api/member/memberinfo.php', //送信先
        type: 'PUT', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: sendMemberInfo
    }).done(function(response) {
        location.href = "";
    }).fail(function(response) {
        console.log(response);
    })
});
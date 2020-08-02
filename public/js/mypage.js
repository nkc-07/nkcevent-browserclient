/* ユーザ情報を表示するための処理 */
let sendMemberInfo;
let myMemberId;

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
        myMemberId = memberInfo['member_id']
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

$('.cancel-button').click(function(e) {
    location.href = "";
})

/* 参加イベントを表示するための処理 */
$(function() {
    let eventparticipationDom = $('.participation-event');

    $.ajax({
            url: '/api/member/memberparticipation.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                "member_id": 2,
            }
        })
        .done(function(response) {
            eventdataInfo = response.data

            eventdataInfo.forEach(function(card) {
                eventparticipationCloneDom = eventparticipationDom.clone();
                eventparticipationCloneDom.find("a").attr("href", "/public/html/event-list/detail/index.html?event-id=" + card.event_id);
                eventparticipationCloneDom.find("a").text(card.event_name);
                eventparticipationCloneDom.show();
                $(".participation-event:first").after(eventparticipationCloneDom);
            });
        })
        .fail(function(response) {
            console.log(response);
        });
});
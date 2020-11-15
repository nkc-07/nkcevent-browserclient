let getRequestParams = (new URL(document.location)).searchParams;
let participationUserDom = $('.participation-user');
var member_list = []; // 権限保持者のみ使う、参加者メンバーの一覧変数

let participationStatus = [
    '参加申込中ユーザー',
    '一般参加者',
    '参加登録権限保持者'
];

$(function() {
    $.ajax({
            url: 'http://localhost:8080/api/group/groupmemberauthority.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'group_id': getRequestParams.get('group-id'),
                'token_id': localStorage.getItem('token')
            }
        })
        .done(function(response) {
            console.log(response);
            if (response['data'].length !== 0) {
                switch (response['data'][0]['authority']) {
                    case '0':
                        $('.applying-btn').show();
                        break;
                    case '1':
                        $('.chat-button').attr(
                            'href',
                            $('.chat-button').attr('href') + getRequestParams.get('group-id')
                        ).show();
                        break;
                    case '2':
                    case '3':
                        editAuthority();
                        break;
                }
            } else {
                $('.request-btn').show();
                $('.request-btn').on('click', noAuthority);
            }
        })
        .fail(function(response) {
            $('.request-btn').show();
            $('.request-btn').on('click', noAuthority);
        })

    //console.log(getRequestParams.get('group-id'));
    $.ajax({
            url: '/api/group/groupinfo.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'group_id': getRequestParams.get('group-id')
            }
        })
        .done(function(response) {
            console.log(response.data[0].group_name);
            // $('.console').text("groupInfo");
            $(".group-name").text(response.data[0].group_name);
            $(".group-description").text(response.data[0].description);

            var last_postdate = response.data[0].last_postdate;
            last_postdate = (last_postdate.substr(0, 4) + '-' + last_postdate.substr(5, 2) + '-' + last_postdate.substr(8, 2));
            $(".create-day p").text(last_postdate);

        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
            //location.href = '/public/html/event-list/';
        })
});
//group-title

function noAuthority() {
    $.ajax({
            url: 'http://localhost:8080/api/group/groupparticipation.php', //送信先
            type: 'POST', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'group_id': getRequestParams.get('group-id'),
                'token_id': localStorage.getItem('token')
            }
        })
        .done(function(response) {
            location.reload();
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
}

function editAuthority() {
    $('.chat-button').attr(
        'href',
        $('.chat-button').attr('href') + getRequestParams.get('group-id')
    ).show();
    $('.owner-icon').show();
    $('.participation-table').show();

    $.ajax({
            url: 'http://localhost:8080/api/group/groupparticipation.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'group_id': getRequestParams.get('group-id'),
                'token_id': localStorage.getItem('token')
            }
        })
        .done(function(response) {
            member_list = response['data']['data'];

            member_list.forEach(element => {
                if (element['authority'] == 3) {
                    $('.organizer-user img').attr('src', element['icon']);
                    $('.organizer-user .user-name').text(element['nickname']);
                } else {
                    let tempParticipationUserDom = participationUserDom.clone();
                    tempParticipationUserDom.find('img').attr('src', element['icon']);
                    tempParticipationUserDom.find('.user-name').text(element['nickname']);
                    tempParticipationUserDom.find('button').text(participationStatus[element['authority']]);
                    $(".participation-list").append(tempParticipationUserDom.show());
                }
            });
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
}
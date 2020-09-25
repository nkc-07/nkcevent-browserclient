let getRequestParams = (new URL(document.location)).searchParams;
let eventAttendanceId;

$(document).on('click', '.dropdown-menu .dropdown-item', function() {
    var visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
    visibleItem.text($(this).text());
    console.log($(this).val());
});

$.ajax({
        url: '/api/member/logincheck.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            token: localStorage.getItem('token')
        }
    })
    .fail(function(response) {
        location.href = '/public/html/event-list/detail/?event-id=' + getRequestParams.get('event-id');
        console.log('通信失敗');
        console.log(response);
    })

$.ajax({
    url: '/api/event/eventinfo.php', //送信先
    type: 'GET', //送信方法
    datatype: 'json', //受け取りデータの種類
    data: {
        'event_id': getRequestParams.get('event-id')
    }
}).done(function(response) {
    eventAttendanceId = response['data']['info'][0]['organizer_id'];
    console.log(eventAttendanceId);
})

$.ajax({
        url: '/api/member/memberinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            token: localStorage.getItem('token')
        }
    })
    .done(function(response) {
        if (!response['data']['info']['member_id'] == eventAttendanceId) {
            location.href = '/public/html/event-list/detail/?event-id=' + getRequestParams.get('event-id');
        }
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })

let attendanceIcons = {
    0: {
        img: '/public/image/svg/question.svg',
        text: '未確認'
    },
    1: {
        img: '/public/image/svg/cross.svg',
        text: '欠席'
    },
    2: {
        img: '/public/image/svg/check.svg',
        text: '出席確認済み'
    }
};

$.ajax({
        url: '/api/event/eventparticipant.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'event_id': getRequestParams.get('event-id')
        }
    })
    .done(function(response) {
        let attendanceUserDom = $('.attendance-user');
        response.data.forEach(function(items) {
            console.log(items)
            attendanceUserDom = attendanceUserDom.clone();
            attendanceUserDom.find('.user-icon img').attr('src', items.icon);
            attendanceUserDom.find('.svg').attr('src', attendanceIcons[items.is_attendance].img);
            attendanceUserDom.find('.dropdown-toggle').text(attendanceIcons[items.is_attendance].text);
            attendanceUserDom.find('.user-icon p').text(items.nickname);
            attendanceUserDom.show();
            $('.attendance-list').append(attendanceUserDom);
        })
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })
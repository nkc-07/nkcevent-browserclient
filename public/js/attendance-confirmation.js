let getRequestParams = (new URL(document.location)).searchParams;
let eventAttendanceId;
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

var conn = new WebSocket('ws://localhost:81?mode=attendance&participation_event=' + getRequestParams.get('event-id'));
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
    console.log(e.data);
    $('.member-id-' + e.data + ' .svg').attr('src', attendanceIcons[2].img);
    $('.member-id-' + e.data + ' .dropdown-toggle').text(attendanceIcons[2].text);
};

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
        console.log(response)
        if (!response['data']['info']['member_id'] == eventAttendanceId) {
            location.href = '/public/html/event-list/detail/?event-id=' + getRequestParams.get('event-id');
        } else {
            $('.organizer-box img').attr('src', response['data']['info']['icon']);
            $('.organizer-box p').text(response['data']['info']['nickname']);
        }
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })

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
            attendanceUserDom.addClass('member-id-' + items.member_id);
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
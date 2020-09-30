let getRequestParams = (new URL(document.location)).searchParams;

let userList; // 出席するメンバーのリスト
let eventAttendanceId; // 主催者のID
let attendanceIcons = { // 出席状況のアイコンとテキスト
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

let attendanceUserDom = $('.attendance-user');

var conn = new WebSocket('ws://localhost:81?mode=attendance&participation_event=' + getRequestParams.get('event-id'));
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
    userList.find(function(element) {
        return e.data == element.member_id
    }).is_attendance = 2;
    $('.member-id-' + e.data + ' .svg').attr('src', attendanceIcons[2].img);
    $('.member-id-' + e.data + ' .dropdown-toggle').text(attendanceIcons[2].text);
};

$(document).on('click', '.filtering .dropdown-item', function(e) {
    showAttendanceList($(this).val());
});

$(document).on('click', '.dropdown-menu .dropdown-item', function() {
    var visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
    visibleItem.text($(this).text());
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
    $('.event-title').text(response['data']['info'][0]['event_name']);
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
        url: '/api/event/eventattendance.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'event_id': getRequestParams.get('event-id')
        }
    })
    .done(function(response) {
        userList = response.data.info;
        showAttendanceList("all");
        $('#qrcode-table').qrcode({
            width: 180,
            height: 180,
            text: response.data.qrcode
        });
        console.log(response.data.qrcode)
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })

function showAttendanceList(changeDisplay) {
    $('.attendance-list').empty();
    let loopFlag = true;
    userList.forEach(function(items) {
        if (items.is_attendance == changeDisplay || changeDisplay === "all") {
            attendanceUserDom = attendanceUserDom.clone();
            attendanceUserDom.addClass('member-id-' + items.member_id);
            attendanceUserDom.find('.user-icon img').attr('src', items.icon);
            attendanceUserDom.find('.svg').attr('src', attendanceIcons[items.is_attendance].img);
            attendanceUserDom.find('.dropdown-toggle').text(attendanceIcons[items.is_attendance].text);
            attendanceUserDom.find('.user-icon p').text(items.nickname);
            attendanceUserDom.show();
            $('.attendance-list').append(attendanceUserDom);

            loopFlag = false;
        }
    });

    if (loopFlag) {
        $('.attendance-list').text('該当するユーザーが存在しません');
    }
}
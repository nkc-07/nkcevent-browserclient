let getRequestParams = (new URL(document.location)).searchParams;
let eventAttendanceId;

$('.dropdown-menu .dropdown-item').click(function() {
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
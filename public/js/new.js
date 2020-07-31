/* イベントを作成するために使用する各情報を入れておくための変数 */
let createEventInfo = {
    'event_name': undefined,
    'event_kana': undefined,
    'event_comment': undefined,
    'map': undefined,
    'image': undefined,
    'post_date': undefined,
    'deadline_date': undefined,
    'held_date': undefined,
    'organizer': undefined,
    'member_limit': undefined
}

$.ajax({
    url: '/api/member/memberinfo.php', //送信先
    type: 'GET', //送信方法
    datatype: 'json', //受け取りデータの種類
    data: {
        token: localStorage.getItem('token')
    }
}).done(function(response) {
    let memberInfo = response['data']['info'];

    $('.user-img').attr('src', memberInfo['icon']);
    $('.nickname').text(memberInfo['nickname']);
    createEventInfo['organizer'] = memberInfo['nickname'];
});

$('.held-date').change(function(e) {
    let date = $(this).val().split('-');

    $('.held-month').text(date[1]);
    $('.held-day').text(date[2].split('T')[0]);
    $('.held-time').text(date[2].split('T')[1]);
});

let toDayObjcr = new Date();
let toDayStr = toDayObjcr.getFullYear() + '-' +
    toDayObjcr.getMonth() + '-' +
    toDayObjcr.getDate();
$('.create-day').text(toDayStr);
createEventInfo['post_date'] = toDayStr;

$('.send-event-img').on('change', function(e) {
    let file = $('.send-event-img').prop('files')[0];
    let fd = new FormData();
    fd.append("file",file);
    console.log(file);
    console.log(fd);
    $.ajax({
        url: '/api/event/eventimage.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            "image": fd["file"]['name'],
        }
    }).done(function(e) {
        console.log('success');
        console.log(e);
    }).fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    });

    let reader = new FileReader();
    reader.onload = function(e) {
        $('.event-img').attr('src', e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});

$('.participation-event').click(function(e) {
    createEventInfo['event_name'] = $('.event-name').val();
    createEventInfo['event_kana'] = 'test_kana';
    createEventInfo['event_comment'] = $('.event-comment').val();
    createEventInfo['map'] = $('.map').val();
    if (typeof $('.send-event-img').prop('files')[0] !== "undefined") {
        createEventInfo['image'] = $('.send-event-img').prop('files')[0].name;
    }
    createEventInfo['deadline_date'] = $('.deadline_date').val();
    createEventInfo['held_date'] = $('.held-date').val();
    createEventInfo['member_limit'] = $('.member_limit').val();

    $.ajax({
        url: '/api/event/eventinfo.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: createEventInfo
    }).done(function(e) {
        console.log('success');
    }).fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    });
});
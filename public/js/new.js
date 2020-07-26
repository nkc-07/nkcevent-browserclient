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

$('.input-day').change(function(e) {
    let date = ($(this).val()).split('-');

    $('.held-month').text(date[1]);
    $('.held-day').text(date[2]);
});

let toDayObjcr = new Date();
let toDayStr = toDayObjcr.getFullYear() + '-' +
    toDayObjcr.getMonth() + '-' +
    toDayObjcr.getDate();
$('.create-day').text(toDayStr);
createEventInfo['post_date'] = toDayStr;

$('.send-event-img').on('change', function(e) {
    let reader = new FileReader();
    reader.onload = function(e) {
        $('.event-img').attr('src', e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});

$('.participation-event').click(function(e) {
    createEventInfo['event_name'] = $('.event-name').val();
    createEventInfo['event_kana'] = undefined;
    createEventInfo['event_comment'] = $('.event-comment').val();
    createEventInfo['map'] = $('.map').val();
    createEventInfo['image'] = $('.send-event-img').prop('files')[0].name;
    createEventInfo['deadline_date'] = undefined;
    createEventInfo['held_date'] = $('.held-date').val();
    createEventInfo['member_limit'] = undefined;

    // $.ajax({
    //     url: '/api/member/memberinfo.php', //送信先
    //     type: 'POST', //送信方法
    //     datatype: 'json', //受け取りデータの種類
    //     data: {
    //         createEventInfo
    //     }
    // })
});
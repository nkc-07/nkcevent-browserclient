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
    let reader = new FileReader();
    reader.onload = function(e) {
        $('.event-img').attr('src', e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});

$('.participation-event').click(function(e) {
    //画像
    var img = new Image();
    var reader = new FileReader();
    var file = $('.send-event-img').prop('files')[0];
    console.log(file);
    if (!file.type.match(/^image\/(bmp|png|jpeg|gif)$/)) {
        alert("対応画像ファイル[bmp|png|jpeg|gif]");
        return;
    }

    reader.onload = function(event) {
        img.onload = function() {
            var data = { data: img.src.split(',')[1] };
            $.ajax({
                url: '/api/event/eventimage.php', //送信先
                type: 'POST', //送信方法
                //: 'xml', //受け取りデータの種類
                data: {
                    "name": file["name"],
                    "image": data,
                }
            }).done(function(response) {
                console.log('success');
                console.log(response);
            }).fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    //イベント詳細
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
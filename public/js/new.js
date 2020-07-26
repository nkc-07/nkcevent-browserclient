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
});

$('.input-day').change(function(e) {
    let date = ($(this).val()).split('-');

    $('.held-month').text(date[1]);
    $('.held-day').text(date[2]);
});

let toDay = new Date();
$('.create-day').text(
    toDay.getFullYear() + '/' +
    toDay.getMonth() + '/' +
    toDay.getDate()
);

$('.send-event-img').on('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        $(".event-img").attr('src', e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});
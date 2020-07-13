$(function() {
    $.ajax({
            url: '../../api/event/eventlist.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {}
        })
        .done(function(response) {
            let dom = $('.card-rink').clone();
            $('.card-columns').append(dom.show());

            dom = dom.clone();
            $('.card-columns').append(dom.show());

        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
})
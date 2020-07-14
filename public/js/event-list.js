$(function() {
    let cardDom = $('.card-rink').clone();

    $.ajax({
            url: '../../../api/event/eventlist.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {}
        })
        .done(function(response) {
            eventCardInfo = response.data

            eventCardInfo.forEach(function(cardItem) {
                cardDom = cardDom.clone();
                console.log(cardDom);
                cardDom.attr('href', './detail/index.html?event-id=' + cardItem.event_id);
                cardDom.find('img').attr('src', '../image/' + cardItem.image);
                cardDom.find('.card-body .held-date').text(cardItem.held_date);
                cardDom.find('.card-body .event-name').text(cardItem.event_name);
                cardDom.find('.card-body .map').text(cardItem.map);
                cardDom.find('.user-info p').text(cardItem.organizer);
                cardDom.find('.user-info img').attr('src', '../../image/svg/' + cardItem.icon);
                cardDom.show();
                $('.card-columns').append(cardDom);
            })
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
})
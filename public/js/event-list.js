let getRequestParams = (new URL(document.location)).searchParams;
$(function() {
    $('[type=serch]').val(getRequestParams.get('event_name'));

    let cardDom = $('.card-rink');

    $.ajax({
            url: '/api/event/eventlist.php' +
                '?event_name=' + getRequestParams.get('event_name'), //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {}
        })
        .done(function(response) {
            eventCardInfo = response.data

            eventCardInfo.forEach(function(cardItem) {
                cardDom = cardDom.clone();
                console.log(cardDom);
                cardDom.attr('href', '/public/html/event-list/detail/index.html?event-id=' + cardItem.event_id);
                cardDom.find('img').attr('src', '/public/image/' + cardItem.image);
                cardDom.find('.card-body .held-date').text(cardItem.held_date);
                cardDom.find('.card-body .event-name').text(cardItem.event_name);
                cardDom.find('.card-body .map').text(cardItem.map);
                cardDom.find('.user-info p').text(cardItem.organizer);
                cardDom.find('.user-info img').attr('src', '/public/image/svg/' + cardItem.icon);
                cardDom.show();
                $('.card-columns').append(cardDom);
            })
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
})
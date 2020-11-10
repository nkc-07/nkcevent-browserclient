let getRequestParams = (new URL(document.location)).searchParams;
let clientMessageDom = $('.chat .client');
let peerMessageDom = $('.chat .peer');

$.ajax({
    url: '/api/member/logincheck.php', //送信先
    type: 'POST', //送信方法
    datatype: 'json', //受け取りデータの種類
    data: {
        token: localStorage.getItem('token')
    }
})
.done(function(response) {
    console.log(response.data.login);
})
.fail(function(response) {
    console.log('通信失敗');
    console.log(response);
    location.href = "/public/html/"
})

$(function() {
    $.ajax({
        url: '/api/group/groupchat.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': getRequestParams.get('group-id')
        }
    })
    .done(function(response) {
        console.log(response);

        response['data'].forEach(element => {
            console.log(element)
            let tempClientMessageDom = clientMessageDom.clone();

            tempClientMessageDom.find('img.icon').attr('src', element['icon']);
            tempClientMessageDom.find('p.name').text(element['name']);
            tempClientMessageDom.find('.message').text(element['chat_cont']);

            $('.chat').append(
                tempClientMessageDom.show()
            );
        });
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })
})
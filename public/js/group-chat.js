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
            'token_id': localStorage.getItem('token'),
            'group_id': getRequestParams.get('group-id')
        }
    })
    .done(function(response) {
        console.log(response);

        response['data'].forEach(element => {
            console.log(element)
            let tempMessageDom;
            if(element['is_client'] === "0") {
                tempMessageDom = clientMessageDom.clone();
            } else {
                tempMessageDom = peerMessageDom.clone();
            }

            tempMessageDom.find('img.icon').attr('src', element['icon']);
            tempMessageDom.find('p.name').text(element['name']);
            tempMessageDom.find('.message').text(element['chat_cont']);

            $('.chat').append(
                tempMessageDom.show()
            );
        });
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })
})
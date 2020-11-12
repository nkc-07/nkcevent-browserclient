let getRequestParams = (new URL(document.location)).searchParams;

var conn = new WebSocket('ws://localhost:81?mode=chat&group-id=' + getRequestParams.get('group-id'));

let clientMessageDom = $('.chat .client');
let peerMessageDom = $('.chat .peer');

conn.onopen = function(e) {
    console.log("Connection established!");
}

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
        response['data'].forEach(element => {
            addMessage(element)
        });
        bottomScroll();
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
    })

    $('#send-message-button').click(function() {
        sendMessage();
        $('#send-message-input').val('');
    });

    $('#send-message-input').keypress(function(event){
        if(event.keyCode == '13'){
            sendMessage();
            $(this).val('');
        }
    });
})

function bottomScroll() {
    let height = $('.chat').height();
    $('.chat').scrollTop(height);
}

function sendMessage() {
    let sendJsonMessage = {
        'token_id': localStorage.getItem('token'),
        'group_id': getRequestParams.get('group-id'),
        'chat_cont': $('#send-message-input').val(),
    };

    conn.send(JSON.stringify(sendJsonMessage));
}

conn.onmessage = function(e) {
    memberData = JSON.parse(e.data);
    console.log(memberData)
    addMessage(memberData);
};

function addMessage(element) {
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
    bottomScroll();
}
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
    groupparticipatedList();
    groupappryList();

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
    let height = $('.chat')[0].scrollHeight;
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

function groupparticipatedList() {
    var group_searchtype = 2;
    var group_pram = localStorage.getItem('token') ? localStorage.getItem('token') : 0;
    console.log(group_pram);
    $.ajax({ 
        url: '/api/group/grouplist.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_searchtype': group_searchtype,
            'group_pram': group_pram,
        }
    })
    .done(function(response) {
        let groupparticipatedDom = $('.group-participated');
        grouplist = response.data;
        if (grouplist.length > 0) {
            grouplist.forEach(function(groupparticipatedInfo) {
                groupparticipatedDom = groupparticipatedDom.clone();
                //console.log(groupparticipatedInfo);
                groupparticipatedDom.find('a').attr('href', '/public/html/group/group-detail/chat/index.html?group-id='+groupparticipatedInfo.group_id);
                groupparticipatedDom.find('a').html(groupparticipatedInfo.group_name);
                groupparticipatedDom.show();
                $(".group-participated-list").append(groupparticipatedDom);
            })
        }
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupappryList() {
    var group_searchtype = 3;
    var group_pram = localStorage.getItem('token') ? localStorage.getItem('token') : 0;
    console.log(group_pram);
    $.ajax({ 
        url: '/api/group/grouplist.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_searchtype': group_searchtype,
            'group_pram': group_pram,
        }
    })
    .done(function(response) {
        let groupappryDom = $('.group-appry');
        grouplist = response.data;
        if (grouplist.length > 0) {
            grouplist.forEach(function(groupappryInfo) {
                groupappryDom = groupappryDom.clone();
                //console.log(groupappryInfo);
                groupappryDom.find('a').attr('href', '/public/html/group/group-detail/index.html?group-id='+groupappryInfo.group_id);
                groupappryDom.find('a').html(groupappryInfo.group_name);
                groupappryDom.show();
                $(".group-appry-list").append(groupappryDom);
            })
        }
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
$('.serch-button').on('click', serchGroupList);
$('.serch-input').on('keyup', function (e) {
    if (e.keyCode == '13') {
        serchGroupList();
    }
})
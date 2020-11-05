let loginInfo = {
    userId: undefined,
    password: undefined
};
$('#group-create').on('click', function() {
    groupCreate();
});
$('#group-member-add').on('click', function() {
    groupMemberadd();
});
$('#group-member-authority').on('click', function() {
    groupMemberAuthority();
});
$('#group-list').on('click', function() {
    groupList();
});
$('#group-info').on('click', function() {
    groupInfo();
});
$('#group-chat-display').on('click', function() {
    groupChatDisplay();
});
$('#group-chat-post').on('click', function() {
    groupChatPoat();
});
//関数リスト
function groupCreate() {
    var description = $('.test-input1').val();
    var group_tag = $('.test-input2').val();
    var group_name = $('.test-input3').val();
    $.ajax({ //ログインチェック(マイページ遷移用)
        url: '/api/group/groupinfo.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'description': description,
            'group_tag': group_tag,
            'group_name': group_name,
        }
    })
    .done(function(response) {
        console.log(response);
        $('.console').text("groupCreate");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupMemberadd() {
    var group_id = $('.test-input1').val();
    var token_id = $('.test-input2').val();
    $.ajax({ 
        url: '/api/group/groupparticipation.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': group_id,
            'token_id': token_id,
        }
    })
    .done(function(response) {
        console.log(response);
        $('.console').text("groupMemberadd");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupMemberAuthority() {
    var group_id = $('.test-input1').val();
    var token_id = $('.test-input2').val();
    var authority = $('.test-input3').val();

    $.ajax({ 
        url: '/api/group/groupmemberauthority.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': group_id,
            'token_id': token_id,
            'authority': authority,
        }
    })
    .done(function(response) {
        console.log(response);
        $('.console').text("groupMemberAuthority");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupList() {
    var group_searchtype = $('.test-input1').val();
    var group_pram = $('.test-input2').val() ? $('.test-input2').val() : 0;
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
        console.log(response);
        $('.console').text("groupList");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupInfo() {
    var group_id = $('.test-input1').val();
    $.ajax({ 
        url: '/api/group/groupinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': group_id,
        }
    })
    .done(function(response) {
        console.log(response);
        $('.console').text("groupInfo");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupChatDisplay() {
    var group_id = $('.test-input1').val();
    //var token_id = $('.test-input2').val();
    var chat_id = $('.test-input2').val();

    $.ajax({ 
        url: '/api/group/groupchat.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': group_id,
            //'token_id': token_id,
            'chat_id': chat_id,
        }
    })
    .done(function(response) {
        console.log(response);
        $('.console').text("groupChatDisplay");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
function groupChatPoat() {
    $('.console').text("groupCreate");
    var group_id = $('.test-input1').val();
    var token_id = $('.test-input2').val();
    var chat_cont = $('.test-input3').val();

    $.ajax({ 
        url: '/api/group/groupchat.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': group_id,
            'token_id': token_id,
            'chat_cont': chat_cont,
        }
    })
    .done(function(response) {
        console.log(response);
        $('.console').text("groupChatDisplay");
    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
}
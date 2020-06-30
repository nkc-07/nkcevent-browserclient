/* イベント */

/*
 *   会員のイベント参加と参加してるイベントの取得
 */
function PostMembrparticipation() {
    $(function() {
        $.ajax({
                url: './api/member/membrparticipation.php', //送信先
                type: 'POST', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'member_id ': 4,
                    'event_id ': 2,
                }
            })
            .done(function(response) {
                console.log('通信成功PostMembrparticipation');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

function GetMembrparticipation() {
    $(function() {
        $.ajax({
                url: './api/member/membrparticipation.php', //送信先
                type: 'GET', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'member_id ': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功GetMembrparticipation');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

/*
 *  　イベントキャンセル情報
 */
function putEventcancellation() {
    $(function() {
        $.ajax({
                url: './api/event/cancellation.php', //送信先
                type: 'PUT', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id ': 2,
                    'event_cancellation ': 1,
                }
            })
            .done(function(response) {
                console.log('通信成功putCancellation');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}

/*
 *   イベントタグ
 */
function deleteEventtag() {
    $(function() {
        $.ajax({
                url: './api/event/eventtag.php', //送信先
                type: 'DELETE', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 1,
                    'event_tag': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功deleteEventtag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

function postEventtag() {
    $(function() {
        $.ajax({
                url: './api/event/eventtag.php', //送信先
                type: 'POST', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 1,
                    'event_tag': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功postEventtag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

/*
 *   参加者
 */
function deleteParticipant() {
    $(function() {
        $.ajax({
                url: './api/event/eventparticipant.php', //送信先
                type: 'DELETE', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 1,
                    'member_id': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功deleteEventparticipant');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

function postParticipant() {
    $(function() {
        $.ajax({
                url: './api/event/eventparticipant.php', //送信先
                type: 'POST', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 1,
                    'member_id': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功postEventparticipant');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

function getParticipant() {
    $(function() {
        $.ajax({
                url: './api/event/eventparticipant.php', //送信先
                type: 'GET', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 1,
                }
            })
            .done(function(response) {
                console.log('通信成功getEventparticipant');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

/*
 *   チャット
 */
function deleteEventchat() {
    $(function() {
        $.ajax({
                url: './api/event/eventchat.php', //送信先
                type: 'DELETE', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'chat_id': 2,
                }
            })
            .done(function(response) {
                console.log('通信成功deleteEventchat');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}

function postEventchat() {
    $(function() {
        $.ajax({
                url: './api/event/eventchat.php', //送信先
                type: 'POST', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 2,
                    'member_id': 1,
                    'chat_cont': "hogehogetest"
                }
            })
            .done(function(response) {
                console.log('通信成功postEventchat');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}

function getEventchat() {
    $(function() {
        $.ajax({
                url: './api/event/eventchat.php', //送信先
                type: 'GET', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'event_id': 1,
                }
            })
            .done(function(response) {
                console.log('通信成功getEventchat');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}



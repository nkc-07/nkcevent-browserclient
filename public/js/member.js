/*メンバー*/

/*
 *   会員プロフィールタグ
 */
function deleteMemberprofiletag() {
    $(function() {
        $.ajax({
                url: './api/event/memberprofiletag.php', //送信先
                type: 'DELETE', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'member_id ': 1,
                    'event_id': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功deleteMemberprofiletag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

function postMemberprofiletag() {
    $(function() {
        $.ajax({
                url: './api/event/memberprofiletag.php', //送信先
                type: 'POST', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'member_id ': 1,
                    'event_id': 4,
                }
            })
            .done(function(response) {
                console.log('通信成功postMemberprofiletag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })
    })
}

/*
 *   タグ
 */
function deleteTag() {
    $(function() {
        $.ajax({
                url: './api/other/tag.php', //送信先
                type: 'DELETE', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'tag_id': 2,
                }
            })
            .done(function(response) {
                console.log('通信成功deleteTag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}

function postTag() {
    $(function() {
        $.ajax({
                url: './api/other/tag.php', //送信先
                type: 'POST', //送信方法
                datatype: 'json', //受け取りデータの種類
                data: {
                    'tag_name': "スポーツ",
                }
            })
            .done(function(response) {
                console.log('通信成功postTag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}

function getTag() {
    $(function() {
        $.ajax({
                url: './api/other/tag.php', //送信先
                type: 'GET', //送信方法
                datatype: 'json', //受け取りデータの種類
            })
            .done(function(response) {
                console.log('通信成功getTag');
                console.log(response);
            })
            .fail(function(response) {
                console.log('通信失敗');
                console.log(response);
            })

    })
}
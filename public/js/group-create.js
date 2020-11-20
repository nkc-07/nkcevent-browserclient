/*let loginInfo = {
    userId: undefined,
    password: undefined
};*/
let searchTagInfo = undefined;
let targetTagInfo = undefined;

$(function() {
    var create_date = new Date();
    create_date = create_date.getFullYear() +"/"+ (create_date.getMonth()+1) +"/"+ create_date.getDate();
    $('.create-date').text(create_date);
});

$('.create-group').on('click', function() {
    sendTag().then(function(result) {
        var description = simplemde.value();
        var group_tag = result;
        var group_name = $('.group-title').val();

        console.log(description);
        console.log(group_tag);
        console.log(group_name);

        $.ajax({ //ログインチェック(マイページ遷移用)
            url: '/api/group/groupinfo.php', //送信先
            type: 'POST', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'token': localStorage.getItem('token'),
                'description': description,
                'group_tag': group_tag,
                'group_name': group_name,
            }
        })
        .done(function(response) {
            console.log(response);
            $('.console').text("groupCreate");
            location.href = '/public/html/group/index.html';
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
    });
});
//group-title

$(function() {
    $.ajax({
        type: "GET",
        url: "/api/other/tag.php",
        dataType: "json"
    })
    .done(function(response) {
        searchTagInfo = response;
        $('.add-tag .tag-text').MySuggest({
            msArrayList: searchTagInfo['autocompleteInfo'],
            msRegExpAll: true
        });
    });

    $('.add-tag .tag-text').on('selected matched', function() {
        targetTagInfo = searchTagInfo['tagInfo'].find(({ tag_name }) => tag_name == $(this).val());
    });

    $('.add-tag .tag-text').on('keyup', function(e) {
        if (e.which == 13) {
            targetTagInfo = searchTagInfo['tagInfo'].find(({ tag_name }) => tag_name == $(this).val());
        }
    });
});

async function sendTag() {
    if (targetTagInfo === undefined) {
        sendTagItem = await newTag($('.add-tag .tag-text').val());
    } else {
        sendTagItem = targetTagInfo['tag_id'];
    }
    return sendTagItem;
}

function newTag(newTagInfo) {
    return new Promise((resolve) => {
        $.ajax({
            type: "POST",
            url: "/api/other/tag.php",
            dataType: "json",
            data: {
                tag_name: newTagInfo
            }
        }).done(function(response) {
            // e['tag_id'] = response['data'];
            console.log(response['data']);
            resolve(response['data']);
        });
    });
}
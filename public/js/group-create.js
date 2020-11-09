/*let loginInfo = {
    userId: undefined,
    password: undefined
};*/
$(function() {
    var create_date = new Date();
    create_date = create_date.getFullYear() +"/"+ (create_date.getMonth()+1) +"/"+ create_date.getDate();
    $('.create-date').text(create_date);
});
$('.create-group').on('click', function() {
    var description =simplemde.value();
    //var group_tag = $('#tag').val();
    var group_tag = "hogehoge";
    var group_name = $('.group-title').val();
    console.log(description);
    //console.log(group_tag);
    console.log(group_name);

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
});
//group-title
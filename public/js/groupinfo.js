/*let loginInfo = {
    userId: undefined,
    password: undefined
};*/
let getRequestParams = (new URL(document.location)).searchParams;
$(function() {
    //console.log(getRequestParams.get('group-id'));
    $.ajax({ 
        url: '/api/group/groupinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'group_id': getRequestParams.get('group-id')
        }
    })
    .done(function(response) {
        console.log(response.data[0].group_name);
       // $('.console').text("groupInfo");
        $(".group-name").text(response.data[0].group_name);
        $(".group-description").text(response.data[0].description);

    var last_postdate = response.data[0].last_postdate;
    last_postdate = (last_postdate.substr(0, 4) + '-' + last_postdate.substr(5, 2) + '-' + last_postdate.substr(8, 2));
        $(".create-day p").text(last_postdate);

    })
    .fail(function(response) {
        console.log('通信失敗');
        console.log(response);
        //location.href = '/public/html/event-list/';
    })
});
//group-title
/*let loginInfo = {
    userId: undefined,
    password: undefined
};*/
let getRequestParams = (new URL(document.location)).searchParams;
$(function() {
    $.ajax({
            url: 'http://localhost:8080/api/group/groupmemberauthority.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'group_id': getRequestParams.get('group-id'),
                'token_id': localStorage.getItem('token')
            }
        })
        .done(function(response) {
            $('.chat-button').attr('href', $('.chat-button').attr('href') + getRequestParams.get('group-id')).show();
            switch (response['data'][0]['authority']) {
                case '1':
                    break;
                case '2':
                    break;
                case '3':
                    editAuthority();
                    break;
            }
        })
        .fail(function(response) {
            $('.request-btn').show();
        })

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

function editAuthority() {
    $('.owner-icon').show();
}
$(function() {
    groupparticipatedList();
    groupappryList();
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
                grouplist.forEach(function(groupInfo) {
                    groupparticipatedDom = groupparticipatedDom.clone();
                    console.log(groupInfo);
                    groupparticipatedDom.find('a').attr('href', '/public/html/group/group-detail/index.html?group-id='+groupInfo.group_id);
                    groupparticipatedDom.find('a').html(groupInfo.group_name);
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
            let groupparticipatedDom = $('.group-appry');
            grouplist = response.data;
            if (grouplist.length > 0) {
                grouplist.forEach(function(groupInfo) {
                    groupparticipatedDom = groupparticipatedDom.clone();
                    console.log(groupInfo);
                    groupparticipatedDom.find('a').attr('href', '/public/html/group/group-detail/index.html?group-id='+groupInfo.group_id);
                    groupparticipatedDom.find('a').html(groupInfo.group_name);
                    groupparticipatedDom.show();
                    $(".group-appry-list").append(groupparticipatedDom);
                })
            }
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
            //location.href = '/public/html/event-list/';
        })
    }
})
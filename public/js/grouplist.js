$(function() {
    grouplist();
    groupparticipatedList();
    groupappryList();
    function grouplist() {
        var group_searchtype = 1;
        //var group_pram = localStorage.getItem('token') ? localStorage.getItem('token') : 0;
        $.ajax({ 
            url: '/api/group/grouplist.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'group_searchtype': group_searchtype,
                //'group_pram': group_pram,
            }
        })
        .done(function(response) {
            let groupDom = $('.group-card');
            grouplist = response.data;
            if (grouplist.length > 0) {
                grouplist.forEach(function(groupInfo) {
                    groupDom = groupDom.clone();
                    //console.log(groupInfo);
                    groupDom.find('.group-name').html(groupInfo.group_name);
                    groupDom.find('.group-detail').html(groupInfo.description);
                    groupDom.find('.user-info p').html(groupInfo.nickname);
                    groupDom.find('.user-info img').attr('src', groupInfo.icon);

                    groupDom.attr('href', '/public/html/group/group-detail/index.html?group-id='+groupInfo.group_id);
                    groupDom.find('a').html(groupInfo.group_name);
                    groupDom.show();
                    $(".group-list").append(groupDom);
                })
            }
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
            //location.href = '/public/html/event-list/';
        })
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

    function serchGroupList() {
        var group_searchtype = 4;
        var group_pram = $(".search-box input").val() ? $(".search-box input").val() : "";
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
            .done(function (response) {
                $('.group-card').not(':first').remove();
                let groupsearchDom = $('.group-card');
                grouplist = response.data;
                if (grouplist.length > 0) {
                    grouplist.forEach(function (groupsearchInfo) {
                        groupsearchDom = groupsearchDom.clone();
                        //console.log(groupsearchInfo);
                        groupsearchDom.find('.group-name').html(groupsearchInfo.group_name);
                        groupsearchDom.find('.group-detail').html(groupsearchInfo.description);
                        groupsearchDom.find('.user-info p').html(groupsearchInfo.nickname);
                        groupsearchDom.find('.user-info img').attr('src', "/image/" + groupsearchInfo.icon);
                        groupsearchDom.attr('href', '/public/html/group/group-detail/index.html?group-id=' + groupsearchInfo.group_id);
                        groupsearchDom.find('a').html(groupsearchInfo.group_name);
                        groupsearchDom.show();
                        $(".group-list").append(groupsearchDom);
                    })
                }
            })
            .fail(function (response) {
                console.log('通信失敗');
                console.log(response);
                //location.href = '/public/html/event-list/';
            })
    }
})
let geteventInfo = {
    eventid: 3,
    eventname: undefined,
    eventcomment: undefined,
    map: undefined,
    image: undefined,
    postdate: undefined,
    deadlinedate: undefined,
    helddate: undefined,
    organizer: undefined,
    eventcancellation: undefined,
    memberlimit: undefined
};

var eventTags = [];

let sendeventInfo = {
    event_name: "Linux協会",
    event_kana: "りなっくすきょうかい",
    event_comment: "みんなもLinuxを使いこなせるようになろう！",
    map: "東京都大田区大森南５",
    image: "Linux.png",
    post_date: "2020-07-13",
    deadline_date: "2020-09-09",
    held_date: "2020-09-15",
    organizer: 1,
    member_limit: 30
}

// formのイベント
$(function() {
/*    $('input').on('keydown', function(e) {
        if (e.which == 13) {
            getLogin();
        }
    })*/
    $("button").on('click', function() {
        geteventdetail();
    });

});

// 取得処理
function geteventdetail(){
    $.ajax({
        url: '../../../api/event/eventinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'event_id': eventInfo['eventid']
        }
    })
    .done(function(response){
        eventdata = response.data.info[0]
        eventInfo['eventid'] = eventdata.event_id;
        eventInfo['eventname'] = eventdata.event_name;
        eventInfo['eventcomment'] = eventdata.event_comment;
        eventInfo['map'] = eventdata.map;
        eventInfo['image'] = eventdata.image;
        eventInfo['postdate'] = eventdata.post_date;
        eventInfo['deadlinedate'] = eventdata.deadline_date;
        eventInfo['held_date'] = eventdata.held_date;
        eventInfo['organizer'] = eventdata.organizer;
        eventInfo['eventcancellation'] = eventdata.event_cancellation;
        eventInfo['memberlimit'] = eventdata.member_limit;
        console.log(eventInfo);
        eventTags = response.data.event_tag;
        console.log(eventTags)
    })
    .fail(function(response) {
        console.log(response);
    })
}

// 登録処理
function posteventdetail(){
    $.ajax({
        url: '../../../api/event/eventinfo.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: sendeventInfo
    })
    .done(function(response) {
        console.log(response);
    })
    .fail(function(response) {
        console.log(response);
    })
}

// 更新処理
function Puteventdetail(){
    console.log("test");
    $.ajax({
        url: '../../../api/event/eventinfo.php', //送信先
        type: 'PUT', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:sendeventInfo
    })
    //通信成功
    .done(function(response) {
        console.log(response);
    })
    //通信失敗
    .fail(function(response) {
        console.log(response);
    })
}

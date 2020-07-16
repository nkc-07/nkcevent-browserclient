let geteventInfo = {
    eventid: 1,
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
var host = [];

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

var detailDom;

// formのイベント
$(function() {
    /*    $('input').on('keydown', function(e) {
            if (e.which == 13) {
                getLogin();
            }
        })*/
    detailDom = $.find(".detail-box")[0];
    console.log(detailDom);
    geteventdetail();

});

// 取得処理
function geteventdetail() {
    $.ajax({
            url: '/api/event/eventinfo.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'event_id': geteventInfo['eventid']
            }
        })
        .done(function(response) {
            eventdata = response.data.info[0]
            geteventInfo['eventid'] = eventdata.event_id;
            geteventInfo['eventname'] = eventdata.event_name;
            geteventInfo['eventcomment'] = eventdata.event_comment;
            geteventInfo['map'] = eventdata.map;
            geteventInfo['image'] = eventdata.image;
            geteventInfo['postdate'] = eventdata.post_date;
            geteventInfo['deadlinedate'] = eventdata.deadline_date;
            geteventInfo['helddate'] = eventdata.held_date;
            geteventInfo['organizer'] = eventdata.organizer;
            geteventInfo['eventcancellation'] = eventdata.event_cancellation;
            geteventInfo['memberlimit'] = eventdata.member_limit;
            console.log(geteventInfo);
            eventTags = response.data.event_tag;
            console.log(eventTags)

            
            console.log(geteventInfo['organizer'])


            $(detailDom).find(".event-top .event-title").text(geteventInfo['eventname']);
            $(detailDom).find(".event-box p").text(geteventInfo['eventcomment']);
            $(detailDom).find(".event-top .event-img img").attr("src", geteventInfo["image"]);
            $(detailDom).find(".event-top .create-day").text(geteventInfo["postdate"])
            $(detailDom).find(".detail-box .day-box").attr("src", geteventInfo["deadlinedate"]);
            $(detailDom).find(".drawer-menu .drawer-brand").text(geteventInfo["postdate"])
            //tag関係
            eventTags.forEach(eventTag => {
                $(".clear-float ").append('<div class="tag-card"><img src="../../../image/tag_icon.jpg"><span>'+ eventTag.tag_name +'</span></div>');    
            });

            //ユーザ名の追加
            $(detailDom).find(".user-icon span").text(geteventInfo["organizer"])
            
            

            var helddate = geteventInfo["helddate"].split(' ');
            helddate = helddate[0].split('-');
            let helddateday = helddate[2];
            let helddatemonth = helddate[1];
            console.log(helddate);
            $(detailDom).find(".held-month").text(helddatemonth);
            $(detailDom).find(".held-day").text(helddateday);
        })
        .fail(function(response) {
            console.log(response);
        })
}

// 登録処理
function posteventdetail() {
    $.ajax({
            url: '/api/event/eventinfo.php', //送信先
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
function Puteventdetail() {
    console.log("test");
    $.ajax({
            url: '/api/event/eventinfo.php', //送信先
            type: 'PUT', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: sendeventInfo
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
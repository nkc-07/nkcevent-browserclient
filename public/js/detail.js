let getRequestParams = (new URL(document.location)).searchParams;

let geteventInfo = {
    eventid: getRequestParams.get('event-id'),
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

$(function() {
    // 取得処理
    $.ajax({
            url: '/api/event/eventinfo.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'event_id': getRequestParams.get('event-id')
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

            $(".event-top .event-title").text(geteventInfo['eventname']);
            $(".event-box p").text(geteventInfo['eventcomment']);
            $(".event-top .event-img img").attr("src", geteventInfo["image"]);
            $(".event-top .create-day").text(geteventInfo["postdate"])
            $(".detail-box .day-box").attr("src", geteventInfo["deadlinedate"]);
            $(".drawer-menu .drawer-brand").text(geteventInfo["postdate"]);

            //tag関係
            let userTag = $('.tag-card');
            eventTags.forEach(eventTag => {
                let targetTag = userTag.clone()
                targetTag.find('span').text(eventTag.tag_name);
                $(".clear-float").append(
                    targetTag.show()
                );
            });

            //ユーザ名の追加
            $(".user-icon span").text(geteventInfo["organizer"])

            helddate = geteventInfo["helddate"].split('-');
            let helddateday = helddate[2];
            let helddatemonth = helddate[1];
            console.log(helddate);
            $(".held-month").text(helddatemonth);
            $(".held-day").text(helddateday);
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
});

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
//get用テストデータ
let geteventInfo = {
    memberid: 2, 
}
//post用テストデータ
let posteventInfo ={
    memberid: 2,
    eventid: 3
}

let eventparticipationDom;

// formのイベント
$(function() {
    eventparticipationDom = $(".card-link").clone();
    posteventparticipation();
});

// 取得処理
function geteventparticipation() {
    $.ajax({
            url: '/api/member/memberparticipation.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                "member_id": geteventInfo['memberid'], 
            }
        })
        .done(function(response) {
            eventdataInfo = response.data
            console.log(eventdataInfo);
            $(".card-link").empty();
            eventdataInfo.forEach(function(card){
                eventparticipationDom = eventparticipationDom.clone();
                console.log(eventparticipationDom);
                eventparticipationDom.attr("href","../../event-list/detail/index.html?event-id=" + card.event_id);
                eventparticipationDom.find(".thumbnail img").attr("src",card.image);
                eventparticipationDom.find(".thumbnail p").text(card.held_date);
                eventparticipationDom.find(".card-body .card-title").text(card.event_name);
                eventparticipationDom.find(".card-body p").text(card.map);
                eventparticipationDom.find(".user-icon p").text(card.organizer);
                eventparticipationDom.find(".user-icon img").attr("src", '../../image/svg/' + card.icon);
                eventparticipationDom.show();
                $(".card-box").append(eventparticipationDom);
            });
           
        })
        .fail(function(response) {
            console.log(response);
        })   
}

//イベント参加登録
function posteventparticipation(){
    $.ajax({
        url: '/api/member/memberparticipation.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            "member_id": posteventInfo['memberid'],
            "event_id" : posteventInfo['eventid']
        }
    })
    .done(function(response) {
        console.log("正");
        console.log(response);
    })
    .fail(function(response) {
        console.log("負");
        console.log(response);
    })   

}
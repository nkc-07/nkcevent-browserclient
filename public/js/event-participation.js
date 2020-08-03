let geteventInfo = {
    memberid: 2,
}

let eventparticipationDom;

// formのイベント
$(function() {
    eventparticipationDom = $(".mx-auto:first");
    geteventparticipation();
});

// 取得処理
function geteventparticipation() {
    $.ajax({
            url: searchUrlGenerater('/api/member/memberparticipation.php?'), //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                "member_id": geteventInfo['memberid'],
            }
        })
        .done(function(response) {
            eventdataInfo = response.data
                console.log(eventdataInfo);
                // $(".card-box").empty();
            eventdataInfo.forEach(function(card) {
                eventparticipationDom = eventparticipationDom.clone();
                eventparticipationDom.find(".card-link").attr("href", "/public/event-list/detail/index.html?event-id=" + card.event_id);
                eventparticipationDom.find(".thumbnail img").attr("src", card.image);
                eventparticipationDom.find(".thumbnail p").text(card.held_date)
                eventparticipationDom.find(".card-body .card-title").text(card.event_name);
                eventparticipationDom.find(".card-body p").text(card.map);
                eventparticipationDom.find(".user-icon p").text(card.organizer);
                eventparticipationDom.find(".user-icon img").attr("src", card.icon);
                eventparticipationDom.show();
                $(".card-box").append(eventparticipationDom);
            });
            /*
            $(eventparticipationDom).find(".card-body .card-title").text(eventdataInfo[1].event_name);
            $(eventparticipationDom).find(".card-body p").text(eventdataInfo[1].map);
            $(eventparticipationDom).find(".thumbnail p").text(eventdataInfo[1].held_date);
            $(eventparticipationDom).find(".user-icon p").text(eventdataInfo[1].organizer);
            */


            /*
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
            */
        })
        .fail(function(response) {
            console.log(response);
        })
}
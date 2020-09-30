let getRequestParams = (new URL(document.location)).searchParams;

let myMembername;
let myMemberId;

var eventTags = [];
var host = [];
var eventDisplayStatus = 0;

//イベント情報
let geteventInfo = {
    eventid: getRequestParams.get('event-id'),
    eventname: undefined,
    eventcomment: undefined,
    map: undefined,
    image: undefined,
    postdate: undefined,
    deadlinedate: undefined,
    helddate: undefined,
    organizer_id: undefined,
    organizer_nickname: undefined,
    eventcancellation: undefined,
    memberlimit: undefined
};

let sendeventInfo = {
    event_name: "Linux協会",
    event_kana: "りなっくすきょうかい",
    event_comment: "みんなもLinuxを使いこなせるようになろう！",
    map: "東京都大田区大森南５",
    image: "Linux.png",
    post_date: "2020-07-13",
    deadline_date: "2020-09-09",
    held_date: "2020-09-15",
    organizer_nickname: 1,
    member_limit: 30
}

$(function() {
    //ログインチェック
    $.ajax({
            url: '/api/member/logincheck.php', //送信先
            type: 'POST', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                token: localStorage.getItem('token')
            }
        })
        .done(function(response) {
            console.log(response.data.login);
            if (!response.data.login) { $('.participat').prop("disabled", true); } //参加ボタン無効化
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
            $('.participat').prop("disabled", true);
        })

    // 取得処理
    $.ajax({
            url: '/api/member/memberinfo.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                token: localStorage.getItem('token')
            }
        })
        .done(function(response) {
            let memberInfo = response['data']['info'];
            /* ユーザのステータスを変更するために使用 */
            sendMemberInfo = memberInfo;
            myMembername = memberInfo['nickname']
            myMemberId = memberInfo['member_id']
            $(".user-icon img").attr("src", memberInfo["icon"])
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })


    $.ajax({
            url: '/api/event/eventparticipant.php', //送信先
            type: 'GET', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                'event_id': getRequestParams.get('event-id')
            }
        })
        .done(function(response) {
            joindata = response.data
            console.log(joindata)
            joindata.forEach(function(e) {
                if (e.member_id == myMemberId) {
                    eventDisplayStatus = 1
                }
            })
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })



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
            geteventInfo['organizer_id'] = eventdata.organizer_id;
            geteventInfo['organizer_nickname'] = eventdata.organizer_nickname;
            geteventInfo['eventcancellation'] = eventdata.event_cancellation;
            geteventInfo['memberlimit'] = eventdata.member_limit;
            console.log(geteventInfo);
            eventTags = response.data.event_tag;
            console.log(eventTags)

            console.log(geteventInfo['organizer_nickname'])

            if (geteventInfo['organizer_id'] == myMemberId) {
                eventDisplayStatus = 2
                if(geteventInfo['eventcancellation'] == 0){
                    //押せなくする
                    eventDisplayStatus = 5
                }
            }


            $(".event-top .event-title").text(geteventInfo['eventname']);
            $(".event-box p").text(geteventInfo['eventcomment']);
            $(".event-top .event-img").attr("src", geteventInfo["image"]);
            $(".event-top .create-day").text(geteventInfo["postdate"])
            $(".detail-box .day-box").attr("src", geteventInfo["deadlinedate"]);
            $(".drawer-menu .drawer-brand").text(geteventInfo["postdate"]);

            //tag関係
            let userTag = $('.tag-card');
            eventTags.forEach(eventTag => {
                let targetTag = userTag.clone()
                targetTag.find('a').attr('href', '/public/html/event-list/index.html?tag_id=' + eventTag.event_tag)
                targetTag.find('span').text(eventTag.tag_name);
                $(".clear-float").append(
                    targetTag.show()
                );
            });

            //ユーザ名の追加
            $(".user-icon span").text(geteventInfo["organizer_nickname"])

            helddate = geteventInfo["helddate"].split('-');
            let helddateday = helddate[2];
            let helddatemonth = helddate[1];
            console.log(helddate);
            $(".held-month").text(helddatemonth);
            $(".held-day").text(helddateday);



            console.log("eventDisplayStatus = " + eventDisplayStatus)
            if(eventDisplayStatus == 5){
                //イベント中止ボタンを押せなくする
                $(".participat").hide();
                $(".cancellation").show();
                $(".text-right .cancellation").css({"background":"red"});
                //$(".cancellation").disabledb == "disabled";
                $("button.cancellation").prop('disabled', true)

            }else if (eventDisplayStatus == 2) {
                //イベント中止
                $(".participat").hide();
                $(".cancellation").show();
                $(".cancellation").click(function() {
                    console.log("中止ボタン");
                    //↓通知処理
                    Swal.fire({
                        title:'イベントは中止しますか？',
                        showCancelButton: true,
                        confirmButtonText:"はい",
                        cancelButtonText:'いいえ',
                        cancelButtonColor: '#4169E1',
                        confirmButtonColor: '#ff0000'

                    }).then((result) => {
                        console.log(result)
                        if (result.value == true) {
                          Swal.fire('中止されました', '', '').then(function(){
                            document.location.reload(true);
                            eventcancellation();
                          })
                        }
                      })

                })
            } else if (eventDisplayStatus == 0) {
                //イベント参加
                $(".participat").click(function() {
                    console.log("イベントボタン");
                    eventparticipation();
                    location.href = "";
                })
            } else {
                //イベントキャンセルボタン処理
                $(".participat").hide();
                $(".cancel").show();
                $(".cancel").click(function() {
                    console.log("キャンセルボタン")
                    eventcancel()
                    location.href = "";
                })
            }
            console.log(geteventInfo['eventcancellation'])


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


/*↓ここからイベントボタン処理↓*/
//イベント参加処理
function eventparticipation() {
    $.ajax({
            url: '/api/event/eventparticipant.php', //送信先
            type: 'POST', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                token_id: localStorage.getItem('token'),
                event_id: getRequestParams.get('event-id')
            }
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

//イベントキャンセル
function eventcancel() {
    $.ajax({
            url: '/api/event/eventparticipant.php', //送信先
            type: 'PUT', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                token_id: localStorage.getItem('token'),
                event_id: getRequestParams.get('event-id')
            }
        })
        //通信成功
        .done(function(response) {
            console.log(response);
            console.log("成功")
        })
        //通信失敗
        .fail(function(response) {
            console.log(response);
            console.log("失敗")
        })
}

//イベント中止(修正必要)
function eventcancellation() {
    $.ajax({
            url: '/api/event/eventcancellation.php', //送信先
            type: 'PUT', //送信方法
            datatype: 'json', //受け取りデータの種類
            data: {
                "event_id": getRequestParams.get('event-id'),
                "event_cancellation": 0
            }
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

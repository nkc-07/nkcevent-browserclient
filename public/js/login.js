/*
 *   ログイン
 */

//ログイン処理
function getLogin(){

  var userID = "test"
  //var userId = getField("user_id");
  var password = "testpass"
  //var password = getField("password");

  var disabled = true;

  
  if (userId.value.length > 0 && password.value.length > 0) {
        disabled = false;
    }
    //var login = getField("login");

    if (disabled) {
      console.log("ログイン成功")
      $.ajax({
        url: './api/member/', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
        }})
        .done(function(response) {
            console.log('通信成功PostMembrparticipation');
            console.log(response);
        })
        .fail(function(response) {
            console.log('通信失敗');
            console.log(response);
        })
    }
 　　else {
 　　　console.log("ログイン失敗")
 $.ajax({
    url: './api/member/', //送信先
    type: 'GET', //送信方法
    datatype: 'json', //受け取りデータの種類
    data: {
    }
})
.done(function(response) {
    console.log('通信成功PostMembrparticipation');
    console.log(response);
})
.fail(function(response) {
    console.log('通信失敗');
    console.log(response);
})
　  }
}


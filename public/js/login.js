/*
 *   ログイン
 */

//ログイン処理
function Login(){

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
    }
 　　else {
 　　　console.log("ログイン失敗")
　  }


}
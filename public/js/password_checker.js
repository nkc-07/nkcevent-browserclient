/*
    条件
    *8文字以上
    半角英数字のみ
*/
function getPasswordLevel(password){
    var level = 0;  
    var pattern = 0;  
    var hasLower = false; 
    var hasUpper = false; 
    var hasNumber = false;  

    for (cnt = 0; cnt < password.length; cnt++) {
  
        var ascii = password.charCodeAt(cnt);
        
        //アルファベット小文字チェック
        if ((ascii >= 97) && (ascii <= 122)) {
          hasLower = true;
        }
        
        //アルファベット大文字チェック
        if ((ascii >= 65) && (ascii <= 90)) {
          hasUpper = true;
        }
        
        //数値チェック
        if ((ascii >= 48) && (ascii <= 57)) {
          hasNumber = true;
        }   
	}
      
    //パターン判別  
    if (hasLower) {pattern++;}
    if (hasUpper) {pattern++;}
    if (hasNumber) {pattern++;}
      
     
	//パスワードレベル判定 
	  
    //辞書に登録されている文字チェック
    var dictionary = ["password","qwerty","abc","admin","root","123",$('input[name=pass]')];
	  
    for (i = 0; i < dictionary.length; i++) {
      if (password.indexOf(dictionary[i]) != -1) {
        level = 1;
        return level;
      }
    }
      
    //数値のみパスワードチェック
    if (password.match(/^[0-9]+$/)) {
		level = 1;
		return level;
		console.log(level);
	}
	
    //長さ：８以上　14未満
    if ((password.length >= 8) && (password.length < 14)) {
		level = 2;
    }
    //長さ：８未満　14未満　パターン２種類以上
    if ((password.length >= 8) && (password.length < 14) && (pattern >= 2)) {
		level = 3;
    }
	//長さ：８未満　14未満　パターン３種類以上
	if ((password.length >= 8) && (password.length < 14) && (pattern >= 3)) {
		level = 4;
	}
	return level;
	
	$("scorebar").style.backgroundPosition = parseInt(level * 6) + "px";
}
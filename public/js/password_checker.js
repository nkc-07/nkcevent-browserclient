/*
    条件
    *8文字以上
    半角英数字のみ
*/
$(function getPasswordLevel(){
    var level = 0;  
    var pattern = 0;  
    var Lower = false; 
    var Upper = false; 
    var Number = false;  

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
        
        //記号チェック
        if (((ascii >= 33) && (ascii <= 47)) ||
            ((ascii >= 58) && (ascii <= 64)) ||
            ((ascii >= 91) && (ascii <= 96)) ||
            ((ascii >= 123) && (ascii <= 126))) {
            hasCharacter = true;
        }
      }
      
      //パターン判別  
      if (hasLower) {pattern++;}
      if (hasUpper) {pattern++;}
      if (hasNumber) {pattern++;}
      //if (hasCharacter) {pattern++;}
      
     
      //パスワードレベル判定 
    
      //辞書に登録されている文字チェック
      var dictionary = ["password","qwerty","abc","admin","root","123"];
      
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
      }
    
      //長さ：８未満
      if (password.length < 8) {
        level = 1;
      }
      //長さ：８以上　14未満
      if ((password.length >= 8) && (password.length < 14)) {
        level = 1;
      }
      //長さ：８未満　14未満　パターン２種類以上
      if ((password.length >= 8) && (password.length < 14) && (pattern >= 2)) {
        level = 2;
      }
      //長さ：８未満　14未満　パターン３種類以上
      if ((password.length >= 8) && (password.length < 14) && (pattern >= 3)) {
        level = 3;
      }
      //長さ：14以上　パターン３種類未満
      if ((password.length >= 14) && (pattern < 3)) {
        level = 2;
      }
      //長さ：14以上　パターン３種類以下
      if ((password.length >= 14) && (pattern >= 3)) {
        level = 4;
      }
      
      
      return level;
}

//大文字,小文字,数字を含む8文字以上のパスワード
/*
$(function(){
    var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;
    $('input[name=pass]').match(reg)
})

*/



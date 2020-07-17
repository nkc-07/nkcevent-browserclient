<?php
require_once(__DIR__.'/../../php/Define.php');
require_once(__DIR__.'/../../php/db.php');
//require_once(__DIR__.'/../../php/ErrorHandling.php');


$response = [];
$resary = [
	'success'=> true,
	'code' => 200,
	'msg' => "",
];

switch($_SERVER['REQUEST_METHOD']){
	case "GET":

		$param = $_GET;
		$ret = GetMemberInformation($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
	
	case "POST":

		$ret = PostMemberInformation($_POST);
		if($ret['success']){
			$response['data'] = 'true';
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;

	case "PUT":

		parse_str(file_get_contents('php://input'), $param);
		$ret = PutMemberInformation($param);
		if($ret['success']){
			//$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

        break;
        
    /*
	case "DELETE":
		
		parse_str(file_get_contents('php://input'), $param);
		$ret = deleteParticipant($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

        break;
    */
	
	default:
		$resary['success'] = false;
		$resary['code'] = 405;
		$resary['msg'] = "許可されていないリクエストです。";
		break;
}

header("Content-Type: application/json; charset=utf-8");

if($resary['success']){
	echo json_encode($response, JSON_UNESCAPED_UNICODE);
}else{
	http_response_code($resary['code']);
	$response['msg'] = $resary['msg'];
	echo json_encode($response, JSON_UNESCAPED_UNICODE);
}

/**
 * ----------------------------------------------------------------------------
 * 	以下関数
 * ----------------------------------------------------------------------------
 */

 //会員情報の登録
function PostMemberInformation($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
        if(empty($param['mailaddress']))			throw new ErrorException($errmsg."mailaddress"); //メールアドレス
        //if(empty($param['member_id']))			throw new ErrorException($errmsg."member_id"); //member_id
        if(empty($param['password']))			throw new ErrorException($errmsg."password"); //パスワード
        if(empty($param['nickname']))			throw new ErrorException($errmsg."nickname"); //ニックネーム
        if(empty($param['gender']))			throw new ErrorException($errmsg."gender"); //性別
        if(empty($param['birthday']))			throw new ErrorException($errmsg."birthday"); //誕生日

        $sql_member = "INSERT INTO member(
					mailaddress,
					nickname,
					gender,
					birthday,
					icon)
					VALUES(:mailaddress,:nickname,:gender,:birthday,'dummy.png')";

		$sql_id = "SELECT member_id
				   FROM member
				   WHERE mailaddress = :mailaddress";

		$sql_pass = "INSERT INTO member_password(
					member_id,
					password)
					VALUES(:member_id, :password)";

		$sql_token = "INSERT INTO access_token(
					member_id,
					token_id)
					VALUES(:member_id, :token_id)";

        $stmt = PDO()->prepare($sql_member);
        $stmt -> bindValue(':mailaddress', $param['mailaddress'], PDO::PARAM_STR);
        //$stmt -> bindValue(':member_id', $param['member_id'], PDO::PARAM_INT);
        $stmt -> bindValue(':nickname', $param['nickname'], PDO::PARAM_STR);
        $stmt -> bindValue(':gender', $param['gender'], PDO::PARAM_INT);
        $stmt -> bindValue(':birthday', $param['birthday'], PDO::PARAM_STR);
		$stmt -> execute();
		//$ret['data'] = $data;

		$stmt2 = PDO()->prepare($sql_id);
        $stmt2 -> bindValue(':mailaddress', $param['mailaddress'], PDO::PARAM_STR);
		$stmt2 -> execute();
		$data2 = $stmt2->fetchColumn();

		$stmt3 = PDO()->prepare($sql_pass);
        $stmt3 -> bindValue(':member_id', $data2, PDO::PARAM_INT);
        $stmt3 -> bindValue(':password', hash_hmac("sha256", $param['password'], "sionunofficialoffer"), PDO::PARAM_STR);
		$stmt3 -> execute();
		//$ret['data'] = $data;

		$stmt4 = PDO()->prepare($sql_token);
		$stmt4 -> bindValue(':member_id', $data2, PDO::PARAM_INT);
        $stmt4 -> bindValue(':token_id', hash_hmac("sha256", $param['mailaddress'], "sionunofficialoffer"), PDO::PARAM_STR);
		$stmt4 -> execute();

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}


//会員情報更新
function PutMemberInformation($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
        if(empty($param['mailaddress']))		throw new ErrorException($errmsg."mailaddress"); //メールアドレス
        if(empty($param['member_id']))			throw new ErrorException($errmsg."member_id"); //member_id
        if(empty($param['password']))			throw new ErrorException($errmsg."password"); //パスワード
        if(empty($param['nickname']))			throw new ErrorException($errmsg."nickname"); //ニックネーム
        if(empty($param['gender']))			    throw new ErrorException($errmsg."gender"); //性別
        if(empty($param['birthday']))			throw new ErrorException($errmsg."birthday"); //誕生日
        
        $sql = "UPDATE member m ,member_password mp
                SET m.mailaddress = :mailadress,
                    m.nickname = :nickname,
                    m.gender = :gender,
                    m.birthday = :birthday,
                    m.icon = :icon,
                    mp.password = :'password'
                WHERE m.member_id = :member_id
                AND   mp.member_id = :member_id";

        $stmt = PDO()->prepare($sql);

        $stmt -> bindValue(':mailaddress', $param['mailaddress'], PDO::PARAM_STR);
        $stmt -> bindValue(':member_id', $param['member_id'], PDO::PARAM_INT);
        $stmt -> bindValue(':password', hash_hmac("sha256", $param['password'], "sionunofficialoffer"), PDO::PARAM_STR);
        $stmt -> bindValue(':nickname', $param['nickname'], PDO::PARAM_STR);
        $stmt -> bindValue(':gender', $param['gender'], PDO::PARAM_INT);
        $stmt -> bindValue(':birthday', $param['birthday'], PDO::PARAM_INT);
        $stmt -> bindValue(':icon', $param['icon'], PDO::PARAM_STR);

		$stmt -> execute();
		//$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$ret['data'] = $data;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}

//会員情報更新
function GetMemberInformation($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
        if(empty($param['token']))			throw new ErrorException($errmsg."member_id"); //member_id

		//会員情報取得SQL文
        $sql1 = "SELECT m.mailaddress, m.member_id, m.nickname ,m.gender, m.birthday, m.icon
				FROM member m
				INNER JOIN access_token token
				ON m.member_id = token.member_id
				WHERE token.token_id = :token_id";

        $stmt = PDO()->prepare($sql1);
        $stmt -> bindValue(':token_id', $param['token'], PDO::PARAM_INT);
		$stmt -> execute();

		$memberinfo = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
		$ret['data']['info'] = $memberinfo;

		//イベントタグの取得
		$sql2=  "SELECT et.event_tag, tag_name
                 FROM event_tag as et
                 INNER JOIN tag as t
                 ON et.event_tag = t.tag_id
				 INNER JOIN event_participant as ep
				 ON et.event_id = ep.event_id
                 WHERE member_id = :member_id";

		$stmt = PDO()->prepare($sql2);
        $stmt -> bindValue(':member_id',  $memberinfo['member_id'],  PDO::PARAM_INT);
		$stmt -> execute();
		$tag = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$ret['data']['event_tag'] = $tag;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}
?>
<?php

require_once(__DIR__.'/../../php/Define.php');
require_once(__DIR__.'/../../php/db.php');
//require_once(__DIR__.'/../../php/ErrorHandling.php');

//test
$response = [];
$resary = [
	'success'=> true,
	'code' => 200,
	'msg' => "",
];

switch($_SERVER['REQUEST_METHOD']){
    case "GET":

		$param = $_GET;
		$ret = getGroupChat($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
	
	case "POST":
		parse_str(file_get_contents('php://input'), $param);
		$ret = postGroupChat($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}
        break;
        
    case "PUT":

        parse_str(file_get_contents('php://input'), $param);
        $ret = putEventinfo($param);
        if($ret['success']){
            $response['data'] = $ret['data'];
        }else{
            $resary['success'] = false;
            $resary['code'] = 400;
            $resary['msg'] = $ret['msg'];
        }

        break;

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



//グループ内容表示
function getGroupChat($param){

	$ret = [
		'success' => true,
		'msg' => "",
    ];
    
	//$db = new DB();
	try{
        if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");
		// if(empty($param['chat_id']))			throw new ErrorException($errmsg."chat_id");
        
        $sql=  "SELECT group_id,chat_id,gc.member_id,m.nickname as name,m.icon as icon,chat_cont,true as is_client
				FROM `group_chat` gc
				LEFT OUTER JOIN member m
				ON gc.member_id = m.member_id
				WHERE gc.member_id IN(SELECT member_id
				FROM access_token
				WHERE token_id = :token_id)
			UNION ALL
				SELECT group_id,chat_id,gc.member_id,m.nickname as name,m.icon as icon,chat_cont,false as is_client
				FROM `group_chat` gc
				LEFT OUTER JOIN member m
				ON gc.member_id = m.member_id
				WHERE gc.member_id NOT IN(SELECT member_id
				FROM access_token
				WHERE token_id = :token_id)
			ORDER BY chat_id";
                // WHERE group_id = :group_id
				// AND chat_id = :chat_id";
				/*AND gc.member_id IN(SELECT member_id
				FROM access_token
				WHERE token_id = :token_id)*/
				

		$stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':group_id',  $param['group_id'],  PDO::PARAM_INT);
		$stmt -> bindValue(':token_id',  $param['token_id'],  PDO::PARAM_STR);
		// $stmt -> bindValue(':chat_id',  $param['chat_id'],  PDO::PARAM_INT);
		$stmt -> execute();
		$eventinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
        $ret['data'] = $eventinfo;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}



//チャット投稿
function postGroupChat($param){

	$ret = [
		'success' => true,
		'msg' => "",
    ];
    
	//$db = new DB();
	try{

        if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
        if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");
        if(empty($param['chat_cont']))			throw new ErrorException($errmsg."chat_cont");

		//メッセージ送信
        $sql=  "INSERT INTO group_chat(
                            group_id,
                            member_id,
                            chat_cont)
				VALUES (:group_id,(SELECT member_id
								   FROM access_token
								   WHERE token_id = :token_id ),:chat_cont)";

		//ユーザ名とアイコンの取得
		$sql2= "SELECT nickname,icon
				FROM member
				WHERE member_id IN(SELECT member_id
									FROM access_token
									WHERE token_id = :token_id)";


		
		$stmt = PDO()->prepare($sql);
		$stmt -> bindValue(':group_id',  $param['group_id'],  PDO::PARAM_INT);
		$stmt -> bindValue(':token_id',  $param['token_id'],  PDO::PARAM_STR);
        $stmt -> bindValue(':chat_cont',  $param['chat_cont'],  PDO::PARAM_STR);
		$stmt -> execute();
		//$eventinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		$stmt2 = PDO()->prepare($sql2);
        $stmt2 -> bindValue(':token_id',  $param['token_id'],  PDO::PARAM_STR);
		$stmt2 -> execute();
		$eventinfo2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
		$ret['data'] = $eventinfo2;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}
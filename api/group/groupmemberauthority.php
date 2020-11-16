<?php
require_once(__DIR__.'/../../php/Define.php');
require_once(__DIR__.'/../../php/db.php');
//require_once(__DIR__.'/../../php/ErrorHandling.php');


$response = [];
$resary = [
	'success'=> true,
	'code' => 200,
	'msg' => ""
];

switch($_SERVER['REQUEST_METHOD']){
	
	case "GET":

		$ret = GetMemberAuthority($_GET);
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
		$ret = putMemberAuthority($param);
		if($ret['success']){
			$response['data'] = 'true';
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


/**
 * null: 未参加 0: 参加申込中 1: 参加者 2: 権限保持者 3: 作成者
 */
function GetMemberAuthority($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");

		$sql = "SELECT gm.authority
				FROM `group` g 
				LEFT OUTER JOIN group_member gm ON g.group_id = gm.group_id 
				WHERE member_id IN (SELECT member_id FROM access_token WHERE token_id = :token_id)
				AND gm.group_id = :group_id";
		
		$stmt =  PDO()->prepare($sql);
		$stmt -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		$stmt -> bindValue(':token_id', $param['token_id'], PDO::PARAM_STR);

		$stmt -> execute();

		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$ret['data'] = $data;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}
	return $ret;
}
function putMemberAuthority($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
		if(empty($param['target_id']))			throw new ErrorException($errmsg."target_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");
		if(!isset($param['authority']))			throw new ErrorException($errmsg."authority");

		$sql1 = "SELECT m.member_id
					FROM member m
					INNER JOIN group_member gm
					ON m.member_id = gm.member_id
					WHERE (
						SELECT authority
						FROM access_token a_t
						INNER JOIN group_member gm
						ON  gm.member_id = a_t.member_id
						WHERE a_t.token_id = :token_id
						AND gm.group_id = :group_id
					) IN (2, 3)
					AND m.member_id = :target_id
					AND gm.group_id = :group_id";
		$stmt =  PDO()->prepare($sql1);
		$stmt -> bindValue(':target_id', $param['target_id'], PDO::PARAM_INT);
		$stmt -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		$stmt -> bindValue(':token_id', $param['token_id'], PDO::PARAM_STR);
		$stmt -> execute();
		$data = $stmt->fetch(PDO::FETCH_ASSOC);

		$sql2 = "UPDATE group_member gm
				SET   gm.authority = :authority
				WHERE gm.group_id = :group_id
				AND gm.member_id = :member_id";
		
		
		$stmt2 =  PDO()->prepare($sql2);
		$stmt2 -> bindValue(':authority', $param['authority'], PDO::PARAM_INT);
		$stmt2 -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		$stmt2 -> bindValue(':member_id', $data['member_id'], PDO::PARAM_INT);

		$stmt -> execute();
		//$ret['data'] = $data;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}
	return $ret;
}


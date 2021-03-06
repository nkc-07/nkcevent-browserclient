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

		$ret = getMemberParticipation($_GET);
		if($ret['success']){
			$response['data'] = $ret;
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
	case "POST":

		$ret = PostMemberParticipation($_POST);
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

function PostMemberParticipation($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");

		$sql = "INSERT INTO group_member(group_id, member_id, authority)
				VALUES (:group_id, (SELECT member_id FROM access_token WHERE token_id = :token_id),0)";

		$stmt =  PDO()->prepare($sql);
		$stmt -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		$stmt -> bindValue(':token_id', $param['token_id'], PDO::PARAM_STR);

		$stmt -> execute();
		//$ret['data'] = $data;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}
	return $ret;
}

function getMemberParticipation($param) {
	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");

		$sql = "SELECT m.member_id, m.nickname, m.icon, gm.authority
				FROM group_member gm
				INNER JOIN member m ON m.member_id = gm.member_id
				WHERE gm.group_id = :group_id
				AND 1 = (SELECT COUNT(*)
					FROM access_token at
					INNER JOIN group_member gm
					ON gm.member_id = at.member_id
					WHERE at.token_id = :token_id
					AND gm.group_id = :group_id
					AND (gm.authority = 2 OR gm.authority = 3)
				)";

		$stmt =  PDO()->prepare($sql);
		$stmt -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		$stmt -> bindValue(':token_id', $param['token_id'], PDO::PARAM_STR);

		$stmt -> execute();
		$ret['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}
	return $ret;
}
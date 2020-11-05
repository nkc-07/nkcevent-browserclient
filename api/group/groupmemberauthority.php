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
	
	case "POST":

		$ret = PostMemberAuthority($_POST);
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

 //メンバー権限不要
function PostMemberAuthority($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");
		if(empty($param['authority']))			throw new ErrorException($errmsg."authority"); 

		$sql = "UPDATE group_member gm
				SET   gm.authority = :authority
				WHERE gm.group_id = :group_id
				AND gm.member_id IN (SELECT member_id FROM access_token WHERE token_id = :token_id)";
		
		$stmt =  PDO()->prepare($sql);
		$stmt -> bindValue(':authority', $param['authority'], PDO::PARAM_INT);
		$stmt -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		$stmt -> bindValue(':token_id', $param['token_id'], PDO::PARAM_INT);

		$stmt -> execute();
		//$ret['data'] = $data;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}
	return $ret;
}


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

		$ret = getGrouplist($_GET);
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


function getGrouplist($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		//group_searchtypeでは検索の種類(0:全検索　1:ユーザーID検索　2:タグ検索)
		//group_pramでは検索の種類に応じた値(ユーザーIDやタグIDなど)
		if(empty($param['group_searchtype']))			throw new ErrorException($errmsg."group_searchtype");
		if(empty($param['group_pram']))			throw new ErrorException($errmsg."group_pram");
		$sql = "";
		if($param['group_searchtype'] == 1){
			$sql = "SELECT g.group_id, g.group_name, g.last_postdate 
					FROM `group` g ";
		}
		if($param['group_searchtype'] == 2){
			$sql = "SELECT g.group_id, g.group_name, g.last_postdate 
					FROM `group` g 
					JOIN group_member gm ON g.group_id = gm.group_id 
					WHERE member_id IN (SELECT member_id FROM access_token WHERE token_id = :group_pram)";
		}
		if($param['group_searchtype'] == 3){
			$sql = "SELECT g.group_id, g.group_name, g.last_postdate 
					FROM `group` g 
					WHERE g.group_tag = :group_pram ";
		}
		$stmt =  PDO()->prepare($sql);
		//$stmt -> bindValue(':group_searchtype',   $param['group_searchtype']	 ,  PDO::PARAM_INT);
		if($param['group_searchtype'] == 2){
			$stmt -> bindValue(':group_pram',   $param['group_pram']	 ,  PDO::PARAM_STR);
		}
		if($param['group_searchtype'] == 3){
			$stmt -> bindValue(':group_pram',   $param['group_pram']	 ,  PDO::PARAM_INT);
		}
		$stmt -> execute();
		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		//$ret['data'] = $pdo->lastInsertId();
		$ret['data'] = $data;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}

?>
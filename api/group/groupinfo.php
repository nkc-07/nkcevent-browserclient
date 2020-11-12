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
		$ret = getGroupinfo($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
	
	case "POST":

		$ret = postGroupinfo($_POST);
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
function getGroupInfo($param){

	$ret = [
		'success' => true,
		'msg' => "",
    ];
    
	//$db = new DB();
	try{
        if(empty($param['group_id']))			throw new ErrorException($errmsg."group_id");
        
        $sql=  "SELECT group_id,description,group_tag,group_name,last_postdate
                FROM `group`
                WHERE group_id = :group_id";

		$stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':group_id',  $param['group_id'],  PDO::PARAM_INT);
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
function postGroupinfo($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['token']))					throw new ErrorException($errmsg . "token");
		if(empty($param['description']))			throw new ErrorException($errmsg."description");
		if(empty($param['group_tag']))				throw new ErrorException($errmsg."group_tag");
		if(empty($param['group_name']))				throw new ErrorException($errmsg."group_name");
		
		$sql = "INSERT INTO `group`(description,group_tag,group_name,last_postdate)
				 VALUES(:description,:group_tag,:group_name,CURRENT_TIMESTAMP)";

		$sql_insert_member = "INSERT INTO group_member (group_id, member_id, authority) 
								VALUES (:group_id, (
									SELECT member_id 
									FROM access_token
									WHERE access_token.token_id = :token_id
								)
								, '3');";
		
		$pdo = PDO();
		$stmt =  $pdo->prepare($sql);
		$stmt -> bindValue(':description',   $param['description']	 ,  PDO::PARAM_STR);
		$stmt -> bindValue(':group_tag', 	 $param['group_tag']	 , 	PDO::PARAM_INT);
		$stmt -> bindValue(':group_name',    $param['group_name']	 ,  PDO::PARAM_STR);

		$stmt -> execute();
		//$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$stmt2 =  $pdo->prepare($sql_insert_member);
		$stmt2 -> bindValue(':group_id',   $pdo->lastInsertId('group_id'),  PDO::PARAM_INT);
		$stmt2 -> bindValue(':token_id',   $param['token'],  PDO::PARAM_STR);
		$stmt2 -> execute();

		//$ret['data'] = $pdo->lastInsertId();
		$ret['data'] = "success";

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}

?>
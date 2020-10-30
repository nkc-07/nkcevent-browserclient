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


function postGroupinfo($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['description']))			throw new ErrorException($errmsg."description");
		if(empty($param['group_tag']))				throw new ErrorException($errmsg."group_tag");
		if(empty($param['group_name']))				throw new ErrorException($errmsg."group_name");
		
		$sql = "INSERT INTO `group`(description,group_tag,group_name,last_postdate)
				 VALUES(:description,:group_tag,:group_name,CURRENT_TIMESTAMP)";

		$stmt =  PDO()->prepare($sql);
		$stmt -> bindValue(':description',   $param['description']	 ,  PDO::PARAM_STR);
		$stmt -> bindValue(':group_tag', 	 $param['group_tag']	 , 	PDO::PARAM_INT);
		$stmt -> bindValue(':group_name',    $param['group_name']	 ,  PDO::PARAM_STR);

		$stmt -> execute();
		//$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
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
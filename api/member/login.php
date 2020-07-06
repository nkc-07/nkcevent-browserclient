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
		$ret = getLogin($param);
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

function getLogin($param){
   
	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
    try{
        if(empty($param['member_id']))			throw new ErrorException($errmsg."member_id");
        if(empty($param['password']))			throw new ErrorException($errmsg."password");
		
		$sql = "SELECT COUNT(*)
				FROM member m
				INNER JOIN member_password p
				ON m.member_id = p.member_id 
				WHERE m.mailaddress = :mailaddress
				AND p.password = :'password'";

        $stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':member_id', $param['member_id'], PDO::PARAM_INT);
        $stmt -> bindValue(':password', $param['password'], PDO::PARAM_STR);
        $stmt -> execute();
		
		if(empty($stmt))
			$data = 0;
		else
			$data = 1;
		
	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
        $ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
    }
    return $ret;
}

?>
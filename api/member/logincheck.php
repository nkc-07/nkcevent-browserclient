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
	case "POST":

		$param = $_POST;
		$ret = postLogincheck($param);
		if($ret['success']){
			$response['data'] = $ret;
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

function postLogincheck($param){

	$ret = [
		'success' => true,
		'login' => false,
		'msg' => "",
	];

    try{
        if(empty($param['token']))			throw new ErrorException($errmsg."token");

		$sql = "SELECT * 
				FROM access_token
				WHERE token_id = :token
				AND token_deadline > NOW()";

        $stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':token', $param['token'], PDO::PARAM_STR);
		$stmt -> execute();
		$login = $stmt->fetchAll();

		if (count($login) == 1) {
			$ret['login'] = true;
		} else {
			if(DEBUG_MODE == 1){
				$ret['login'] = true;
			}
		}

	}catch(Exception $err){
        $ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
    }
    return $ret;
}

?>
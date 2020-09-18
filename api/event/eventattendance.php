<?php

require_once(__DIR__.'/../../php/Define.php');
require_once(__DIR__.'/../../php/db.php');

$response = [];
$resary = [
	'success'=> true,
	'code' => 200,
	'msg' => "",
];

switch($_SERVER['REQUEST_METHOD']){
	case "PUT":
		parse_str(file_get_contents('php://input'), $param);
		$ret = putEventattendance($param);
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

function putEventattendance($param) {
    return;
}
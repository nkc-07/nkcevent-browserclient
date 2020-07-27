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
		$ret = getLogin($param);
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

function getLogin($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

    try{
        if(empty($param['mailaddress']))			throw new ErrorException($errmsg."mailaddress");
        if(empty($param['password']))			throw new ErrorException($errmsg."password");

		$sql = "SELECT m.member_id
				FROM member m
				INNER JOIN member_password p
				ON m.member_id = p.member_id
				WHERE m.mailaddress = :mailaddress
				AND p.password = :password";

        $stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':mailaddress', $param['mailaddress'], PDO::PARAM_STR);
        $stmt -> bindValue(':password', hash_hmac("sha256", $param['password'], "sionunofficialoffer"), PDO::PARAM_STR);
		$stmt -> execute();
		$userCount = $stmt->fetchAll();

		if (count($userCount) == 1) {
			$uniqueToken = uniqid();
			$userId = $userCount[0]['member_id'];

			$sqlToken = "UPDATE access_token
						SET token_id = :token_id,
						token_deadline = (NOW() + INTERVAL 1 MONTH)
						WHERE member_id = :member_id";

			$accessStmt = PDO()->prepare($sqlToken);
			$accessStmt -> bindValue(':token_id', $uniqueToken, PDO::PARAM_STR);
			$accessStmt -> bindValue(':member_id', $userId, PDO::PARAM_INT);
			$accessStmt -> execute();

			$ret['success'] = true;
			$ret['token'] = $uniqueToken;
		} else {
			$ret['success'] = false;
		}

	}catch(Exception $err){
        $ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
    }
    return $ret;
}

?>
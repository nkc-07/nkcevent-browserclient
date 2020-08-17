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

	case "POST":
		$ret = postPasswordCheck($_POST);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}
		break;

	case "PUT":

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

 function postPasswordCheck($param) {
    $ret = [
		'success' => true,
		'msg' => "",
    ];

	try{
		if(empty($param['token']))			throw new ErrorException($errmsg."token");
        if(empty($param['password']))			throw new ErrorException($errmsg."password");

        $sql= "SELECT COUNT(*) login_cnt
                FROM member_password m_p
                INNER JOIN access_token a_c
                ON a_c.member_id = m_p.member_id
                WHERE a_c.token_id = :token
                AND m_p.password = :password";

		$stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':token',  $param['token'],  PDO::PARAM_STR);
        $stmt -> bindValue(':password',  hash_hmac("sha256", $param['password'], "sionunofficialoffer"), PDO::PARAM_STR);
        $stmt -> execute();
        $loginCheckCnt = $stmt->fetch(PDO::FETCH_ASSOC);

        if (
            count($loginCheckCnt) == 1 &&
            $loginCheckCnt['login_cnt'] == 1
        ) {
    		$ret['data'] = true;
        } else {
            $ret['data'] = false;
        }

	}catch(Exception $err){
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
 }
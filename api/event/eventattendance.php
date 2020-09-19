<?php
// header("Access-Control-Allow-Origin: *");           // TODO: サーバにアップ次第変更...
// header("Access-Control-Allow-Methods: PUT");

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
			$resary['success'] = true;
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

    $ret = [
		'success' => true,
		'msg' => "",
    ];
    
	try {
		if(empty($param['event_id']))			throw new ErrorException($errmsg."event_id");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");

		$sql = "SELECT event_participant.member_id
                FROM event_participant 
                INNER JOIN event
                ON event_participant.event_id = event.event_id
                INNER JOIN access_token
                ON access_token.member_id = event_participant.member_id
                WHERE event.event_id = :event_id
                AND access_token.token_id = :token_id";

        $stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':event_id', $param['event_id'], PDO::PARAM_INT);
        $stmt -> bindValue(':token_id', $param['token_id'], PDO::PARAM_STR);
        $stmt -> execute();
        $isparticipant = $stmt->fetchAll();
        
        if(count($isparticipant) == 1) {
            $ret['data']['participant_member'] = $isparticipant[0]['member_id'];

            //TODO: イベント参加テーブルにデータをアップデート
        } else {
            $ret['success'] = false;
			$ret['data'] = false;
        }
    } catch (Exception $err) {
        $ret['success'] = false;
        $ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
    }

	return $ret;
}
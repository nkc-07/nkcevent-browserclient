<?php
// header("Access-Control-Allow-Origin: *");           // TODO: サーバにアップ次第変更...
// header("Access-Control-Allow-Methods: PUT");

require_once(__DIR__ . '/../../php/Define.php');
require_once(__DIR__ . '/../../php/db.php');

$response = [];
$resary = [
	'success' => true,
	'code' => 200,
	'msg' => "",
];

switch ($_SERVER['REQUEST_METHOD']) {
	case "GET":
		$param = $_GET;
		$ret = getEventattendance($param);
		if ($ret['success']) {
			$response['data'] = $ret['data'];
		} else {
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}
		break;
	case "PUT":
		parse_str(file_get_contents('php://input'), $param);
		$ret = putEventattendance($param);
		if ($ret['success']) {
			$resary['success'] = true;
			$response['data'] = $ret['data'];
		} else {
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

if ($resary['success']) {
	echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else {
	http_response_code($resary['code']);
	$response['msg'] = $resary['msg'];
	echo json_encode($response, JSON_UNESCAPED_UNICODE);
}

function getEventattendance($param)
{
	$ret = [
		'success' => true,
		'msg' => "",
	];

	try {
		if (empty($param['event_id']))			throw new ErrorException($errmsg . "event_id");

		$sql = "SELECT event_id, m.member_id, nickname, icon, is_attendance
                FROM event_participant p
                INNER JOIN member m
                ON p.member_id = m.member_id
                WHERE event_id = :event_id";

		$stmt = PDO()->prepare($sql);
		$stmt->bindValue(':event_id', $param['event_id'], PDO::PARAM_INT);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$ret['data']['info'] = $data;
		$ret['data']['qrcode'] = hash_hmac("sha256", $param['event_id'], "sionunofficialoffer");
	} catch (Exception $err) {
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[" . date("Y-m-d H:i:s") . "]" . $err->getMessage();
	}

	return $ret;
}

function putEventattendance($param)
{

	$ret = [
		'success' => true,
		'msg' => "",
	];

	try {
		if (empty($param['event_id']))			throw new ErrorException($errmsg . "event_id");
		if (empty($param['token_id']))			throw new ErrorException($errmsg . "token_id");
		if (empty($param['qrcode_value']))		throw new ErrorException($errmsg . "qrcode_value");
		if (!isset($param['status']))			throw new ErrorException($errmsg . "status");

		$sql = "SELECT event_participant.member_id, event.event_id, event.organizer
                FROM event_participant
                INNER JOIN event
                ON event_participant.event_id = event.event_id
                WHERE event.event_id = :event_id
				AND event_participant.member_id = (
                	SELECT ac.member_id
                    FROM access_token ac
                    WHERE ac.token_id = :token_id
                )";

		$stmt = PDO()->prepare($sql);
		$stmt->bindValue(':event_id', $param['event_id'], PDO::PARAM_INT);
		$stmt->bindValue(':token_id', $param['token_id'], PDO::PARAM_STR);
		$stmt->execute();
		$isparticipant = $stmt->fetchAll();

		if (
			count($isparticipant) == 1 &&
			hash_hmac("sha256", $isparticipant[0]['event_id'], "sionunofficialoffer") == $param['qrcode_value']
		) {
			$splUpdate = "UPDATE event_participant
                    SET is_attendance = :status
                    WHERE event_participant.event_id = :event_id
                    AND event_participant.member_id = ";

			$tempSqlData = [$param['token_id'], PDO::PARAM_STR];
			if (array_key_exists('target_member_id', $param)) {
				$isTargetSql = "SELECT member_id
								FROM event_participant
								INNER JOIN event
								ON event.event_id = event_participant.event_id
								WHERE member_id = :target_id
								AND event.event_id = :event_id";
				$stmt = PDO()->prepare($isTargetSql);
				$stmt->bindValue(':target_id', $param['target_member_id'], PDO::PARAM_INT);
				$stmt->bindValue(':event_id', $param['event_id'], PDO::PARAM_INT);
				$stmt->execute();
				$isMember = $stmt->fetchAll();
				if (count($isMember) == 1) {

					$splUpdate .= ':is_member';
					$tempSqlData[0] = $param['target_member_id'];
					$tempSqlData[1] = PDO::PARAM_INT;

					$ret['data']['participant_member'] = $isMember[0]['member_id'];
				}
			} else {
				$splUpdate .= '(
					SELECT member_id
					FROM access_token
					WHERE token_id = :is_member
				)';
				$ret['data']['participant_member'] = $isparticipant[0]['member_id'];
			}

			$stmt = PDO()->prepare($splUpdate);
			$stmt->bindValue(':event_id', $param['event_id'], PDO::PARAM_INT);
			$stmt->bindValue(':is_member', $tempSqlData[0], $tempSqlData[1]);
			$stmt->bindValue(':status', $param['status'], PDO::PARAM_INT);

			$stmt->execute();
			$ret['data']['status'] = $param['status'];
		} else {
			$ret['success'] = false;
			$ret['data'] = false;
		}
	} catch (Exception $err) {
		$ret['success'] = false;
		$ret['msg'] = "[" . date("Y-m-d H:i:s") . "]" . $err->getMessage();
	}

	return $ret;
}

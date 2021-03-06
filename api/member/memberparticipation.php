<?php

require_once(__DIR__ . '/../../php/Define.php');
require_once(__DIR__ . '/../../php/db.php');
//require_once(__DIR__.'/../../php/ErrorHandling.php');


$response = [];
$resary = [
	'success' => true,
	'code' => 200,
	'msg' => "",
];

switch ($_SERVER['REQUEST_METHOD']) {
	case "GET":

		$param = $_GET;
		$ret = GetMembrparticipation($param);
		if ($ret['success']) {
			$response['data'] = $ret['data'];
		} else {
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
	case "POST":

		$ret = PostMembrparticipation($_POST);
		if ($ret['success']) {
			$response['data'] = $ret['data'];
		} else {
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;

		/*
	case "PUT":

		parse_str(file_get_contents('php://input'), $param);
		$ret = putEventchat($param);
		if($ret['success']){
			//$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
    */
		/*
	case "DELETE":

			
		parse_str(file_get_contents('php://input'), $param);
		$ret = deleteprofiletag($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

        break;
        
    */

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



/**
 * ----------------------------------------------------------------------------
 * 	以下関数
 * ----------------------------------------------------------------------------
 */



//イベント参加登録
function PostMembrparticipation($param)
{

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try {
		if (empty($param['member_id']))			throw new ErrorException($errmsg . "member_id");
		if (empty($param['event_id']))			throw new ErrorException($errmsg . "event_id");
		$sql = "INSERT INTO event_participant(
			  event_id,member_id)
              VALUES(:event_id:member_id)";

		$stmt = PDO()->prepare($sql);
		$stmt->bindValue(':event_id',  $param['event_id'],  PDO::PARAM_INT);
		$stmt->bindValue(':member_id',  $param['member_id'],  PDO::PARAM_INT);
		$stmt->execute();

		$ret['data'] = "success";
	} catch (Exception $err) {
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[" . date("Y-m-d H:i:s") . "]" . $err->getMessage();
	}

	return $ret;
}



/*イベント参加情報の取得*/
function GetMembrparticipation($param)
{

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try {
		$flag_Ename = false;

		if (empty($param['member_id']))			throw new ErrorException($errmsg . "member_id");
		if (empty($param['limit']))            	throw new ErrorException($errmsg . "limit");
		if (empty($param['page']))            	throw new ErrorException($errmsg . "page");

		$sql = "SELECT e.event_id,event_name,map,image,held_date,m.nickname as organizer,icon,e.event_cancellation
			FROM event_participant ep
			INNER JOIN event e
			ON  e.event_id = ep.event_id
			INNER JOIN member m
			ON m.member_id = e.organizer
			WHERE ep.member_id = :member_id ";

		if (array_key_exists('event_name', $param)) {
			$sql .= "AND e.event_name LIKE :event_name";
			$flag_Ename = true;
		}
		//$sql .= ' GROUP BY event_cancellation';
		$sql .= ' ORDER BY event_cancellation DESC';
		$sql .= ' , ' . generateSortSql($param);
		$sql .= ' LIMIT :limit OFFSET :page';

		$stmt = PDO()->prepare($sql);
		$stmt->bindValue(':member_id',  $param['member_id'],  PDO::PARAM_INT);
		$stmt->bindValue(':limit', (int)$param['limit'], PDO::PARAM_INT);
		$stmt->bindValue(':page', $param['limit'] * ($param['page'] - 1), PDO::PARAM_INT);

		if ($flag_Ename)
			$stmt->bindValue(':event_name', '%' . $param['event_name'] . '%', PDO::PARAM_STR);

		$stmt->execute();

		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$ret['data'] = $data;
	} catch (Exception $err) {
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[" . date("Y-m-d H:i:s") . "]" . $err->getMessage();
	}

	return $ret;
}


function generateSortSql($paramValues) {
	if(array_key_exists('sort', $paramValues)) {
		switch($paramValues['sort']){
			case 'recent_held_event':
				$sortSql = 'e.held_date DESC';
				break;
			case 'recent_post_event':
				$sortSql = 'e.post_date DESC';
				break;
			default:
				throw new ErrorException('Invalid parameter value');
			}
	} else {
		$sortSql = 'e.held_date DESC';
	}

	return $sortSql;
}
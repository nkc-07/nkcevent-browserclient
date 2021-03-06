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
		$ret = getEventinfo($param);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}

		break;
	
	case "POST":

		$ret = postEventinfo($_POST);
		if($ret['success']){
			$response['data'] = $ret['data'];
		}else{
			$resary['success'] = false;
			$resary['code'] = 400;
			$resary['msg'] = $ret['msg'];
		}
        break;
        
    case "PUT":

        parse_str(file_get_contents('php://input'), $param);
        $ret = putEventinfo($param);
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



//ユーザーのプロフィールタグ登録
function getEventinfo($param){

	$ret = [
		'success' => true,
		'msg' => "",
    ];
    
	//$db = new DB();
	try{
		if(empty($param['event_id']))			throw new ErrorException($errmsg."event_id");
        $sql=  "SELECT e.event_id, e.event_name, e.event_comment, e.map, e.image, e.post_date, e.deadline_date, e.held_date,
					m.nickname AS organizer_nickname, m.icon as organizer_icon, m.member_id AS organizer_id, e.member_limit, e.event_cancellation,
					e.group_id, IFNULL((
						SELECT g.group_name
						FROM `group` g
						WHERE g.group_id = e.group_id
						), null) as group_name
				FROM `event` e
				INNER JOIN member m
				ON e.organizer = m.member_id
				WHERE event_id = :event_id";

		$stmt = PDO()->prepare($sql);
        $stmt -> bindValue(':event_id',  $param['event_id'],  PDO::PARAM_INT);
		$stmt -> execute();
		$eventinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
        $ret['data']['info'] = $eventinfo;

        $sql2=  "SELECT et.event_tag, tag_name 
                 FROM `event_tag` et
                 INNER JOIN tag t
                 ON et.event_tag = t.tag_id
                 WHERE event_id = :event_id";

		$stmt = PDO()->prepare($sql2);
        $stmt -> bindValue(':event_id',  $param['event_id'],  PDO::PARAM_INT);
		$stmt -> execute();
		$tag = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		$ret['data']['event_tag'] = $tag;

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}
function postEventinfo($param){

	$ret = [
		'success' => true,
		'msg' => "",
	];

	//$db = new DB();
	try{
		if(empty($param['event_name']))			throw new ErrorException($errmsg."event_name");
		if(empty($param['event_kana']))			throw new ErrorException($errmsg."event_kana");
		if(empty($param['event_comment']))		throw new ErrorException($errmsg."event_comment");
		if(empty($param['map']))				throw new ErrorException($errmsg."map");
		if(empty($param['image']))				$param['image'] = "dummy.png";
		if(empty($param['post_date']))			throw new ErrorException($errmsg."post_date");
		if(empty($param['deadline_date']))		throw new ErrorException($errmsg."deadline_date");
		if(empty($param['held_date']))			throw new ErrorException($errmsg."held_date");
		if(empty($param['token_id']))			throw new ErrorException($errmsg."token_id");
		if(empty($param['member_limit']))		throw new ErrorException($errmsg."member_limit");

		//event_cancellationは1で挿入(開催)
		$sql = "INSERT INTO `event`(event_name, event_kana, event_comment, map, `image`, post_date, deadline_date, held_date, group_id, organizer, member_limit, event_cancellation) 
				VALUES (:event_name, :event_kana, :event_comment, :map, :image,:post_date,
				:deadline_date, :held_date, :group_id, 
				(
					SELECT member_id
					FROM access_token
					WHERE access_token.token_id = :token_id
				), :member_limit, 1)";

		$pdo = PDO();
		$stmt = $pdo->prepare($sql);
		$stmt -> bindValue(':event_name',  	 $param['event_name'],  PDO::PARAM_STR);
		$stmt -> bindValue(':event_kana', 	 $param['event_kana'], PDO::PARAM_STR);
		$stmt -> bindValue(':event_comment', htmlspecialchars($param['event_comment'], ENT_QUOTES), PDO::PARAM_LOB);
		$stmt -> bindValue(':map', 			 $param['map'], PDO::PARAM_STR);
		$stmt -> bindValue(':image', 		 $param['image'], PDO::PARAM_STR);
		$stmt -> bindValue(':post_date', 	 $param['post_date'], PDO::PARAM_STR);
		$stmt -> bindValue(':deadline_date', $param['deadline_date'], PDO::PARAM_STR);
		$stmt -> bindValue(':held_date', 	 $param['held_date'], PDO::PARAM_STR);
		if($param['group_id'] == 'null') {
			$stmt -> bindValue(':group_id',  null, PDO::PARAM_INT);
		} else {
			$stmt -> bindValue(':group_id',  $param['group_id'], PDO::PARAM_INT);
		}
		$stmt -> bindValue(':token_id', 	 $param['token_id'], PDO::PARAM_STR);
		$stmt -> bindValue(':member_limit',  $param['member_limit'], PDO::PARAM_INT);
		$stmt -> execute();

		$sql2 = "INSERT INTO event_participant (event_id, member_id) VALUES (:event_id, (
			SELECT member_id
			FROM access_token
			WHERE access_token.token_id = :token_id));";

		$stmt =  PDO()->prepare($sql2);
		$stmt -> bindValue(':event_id',  	 $pdo->lastInsertId('event_id'),  PDO::PARAM_INT);
		$stmt -> bindValue(':token_id', 	 $param['token_id'], PDO::PARAM_STR);

		$stmt -> execute();
		//$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		$ret['data'] = $pdo->lastInsertId();
		// $ret['data'] = "success";

	}catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
	}

	return $ret;
}
function putEventinfo($param){
    $ret = [
        'success' => true,
        'msg' => "",
    ];

    //$db = new DB();
    try{
		if(empty($param['event_name']))			throw new ErrorException($errmsg."event_name");
		if(empty($param['event_kana']))			throw new ErrorException($errmsg."event_kana");
		if(empty($param['event_comment']))		throw new ErrorException($errmsg."event_comment");
		if(empty($param['map']))				$param['map'] = NULL;
		if(empty($param['image']))				$param['image'] = "dummy.png";
		if(empty($param['post_date']))			throw new ErrorException($errmsg."post_date");
		if(empty($param['deadline_date']))		throw new ErrorException($errmsg."deadline_date");
		if(empty($param['held_date']))			throw new ErrorException($errmsg."held_date");
		if(empty($param['organizer']))			throw new ErrorException($errmsg."organizer");
		if(empty($param['member_limit']))		throw new ErrorException($errmsg."member_limit");
        $sql = "UPDATE `event`
				SET event_name = :event_name,
					event_kana = :event_kana,
					event_comment = :event_comment,
					map = :map,
					`image` = :image,
					post_date = :post_date,
					deadline_date = :deadline_date,
					held_date = :held_date,
					member_limit = :member_limit
				WHERE event_id = :event_id";
        $stmt = PDO() -> prepare($sql);
		$stmt -> bindValue(':event_name',  	 $param['event_name'],  PDO::PARAM_STR);
		$stmt -> bindValue(':event_kana', 	 $param['event_kana'], PDO::PARAM_STR);
		$stmt -> bindValue(':event_comment', $param['event_comment'], PDO::PARAM_STR);
		$stmt -> bindValue(':map', 			 $param['map'], PDO::PARAM_STR);
		$stmt -> bindValue(':`image`', 		 $param['image'], PDO::PARAM_STR);
		$stmt -> bindValue(':post_date', 	 $param['post_date'], PDO::PARAM_STR);
		$stmt -> bindValue(':deadline_date', $param['deadline_date'], PDO::PARAM_STR);
		$stmt -> bindValue(':held_date', 	 $param['held_date'], PDO::PARAM_STR);
		$stmt -> bindValue(':member_limit',  $param['member_limit'], PDO::PARAM_INT);   
		$stmt -> bindValue(':event_id',  	 $param['event_id'], PDO::PARAM_INT);   

		$stmt -> execute();
        //$data = $stmt -> fetchAll(PDO::FETCH_ASSOC);

        $ret['data'] = "success";

    }catch(Exception $err){
		//exceptionErrorPut($err, "EXCEPTION");
		$ret['success'] = false;
		$ret['msg'] = "[".date("Y-m-d H:i:s")."]".$err->getMessage();
    }
    
    return $ret;

}


?>
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
		$ret['success'] = 1;
		$file_name = uniqid(); // アップロード時のファイル名を設定
		$file_save = "../../image/" . $file_name .".jpg"; // アップロード対象のディレクトリを指定
		$img = $_POST['image']['data'];
		$img = str_replace('data:image/jpeg;base64,', '', $img);
		//$img = str_replace(' ', '+', $img);
		$fileData = base64_decode($img);
		file_put_contents($file_save,$fileData); // アップロード処理
		if($ret['success']){
			$data = $img;
			$response['data'] = $file_name .".jpg";
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

if($resary['success']){
	echo json_encode($response, JSON_UNESCAPED_UNICODE);
}else{
	http_response_code($resary['code']);
	$response['msg'] = $resary['msg'];
	echo json_encode($response, JSON_UNESCAPED_UNICODE);
}

?>
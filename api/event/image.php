<?php

require_once(__DIR__.'/../../php/Define.php');
require_once(__DIR__.'/../../php/db.php');
require_once(__DIR__.'/../../vendor/autoload.php');
//require_once(__DIR__.'/../../php/ErrorHandling.php');

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

$s3client = new S3Client([
	'version' => 'latest',
	'region' => 'ap-northeast-1',
	'credential' => false
]);

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
		$file_save = "image/" . $file_name .".jpg"; // アップロード対象のディレクトリを指定
		$img = $_POST['image']['data'];
		$img = str_replace('data:image/jpeg;base64,', '', $img);
		//$img = str_replace(' ', '+', $img);
		$fileData = base64_decode($img);
		$uploadResult = $s3client -> putObject([
			'Bucket' => AWS_S3_ARN,
			'Key'    => $file_save,
			'Body'   => $fileData
		]);
		if($uploadResult['@metadata']["statusCode"]==400){
			$ret['success'] = false;
			$resary['code'] = 500;
			$resary['msg'] = "S3側に問題が発生しています(400:パラメータに不正が確認されました)";
		}
		if($uploadResult['@metadata']["statusCode"]==403){
			$ret['success'] = false;
			$resary['code'] = 500;
			$resary['msg'] = "S3側に問題が発生しています(403:アクセスが拒否されました)";
		}
		if($uploadResult['@metadata']["statusCode"]==408){
			$ret['success'] = false;
			$resary['code'] = 500;
			$resary['msg'] = "S3側に問題が発生しています(408:タイムアウトが発生しました。障害が発生している可能性があります。)";
		}

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
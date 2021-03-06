<?php

header("Access-Control-Allow-Origin: *");           // TODO: サーバにアップ次第変更...
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {		// TODO: ちゃんとしたCORS処理に変更　上記のも...
	exit;
}

/**
 * ----------------------------------------------------------------------------
 * 以下定数
 * ----------------------------------------------------------------------------
 * 
 */

date_default_timezone_set ('Asia/Tokyo');

define("SERVER_HOST",			"http://localhost:3306");

define("PDO_DSN",				"mysql:host=localhost:3306;dbname=event");
define("PDO_USER",				"sa");
define("PDO_PASS",				"P@ssw0rd");

define("ERROR_EXCEPTION_LOG",	dirname(__DIR__)."/log");	// ログを吐き出すディレクトリ

define("DATETIME",				date("Y-m-d H:i:s"));

define("CURRENT_TIMESTAMP",		"CURRENT_TIMESTAMP");		// sqlで使う、サーバの時刻に依存するので必要ならここで変える
define("DATE_INIT_VALUE",		"1899-12-30 00:00:00");		// 日付の初期値
define("DEBUG_MODE",		0);		// デバッグモード

global $errmsg;
$errmsg = "";

/**
 * ----------------------------------------------------------------------------
 * 汎用関数
 * ----------------------------------------------------------------------------
 * 
 */


/**
 * PDO作成して返す
 * 
 */
function PDO(){
	$pdo	= new PDO(
		PDO_DSN
		,PDO_USER
		,PDO_PASS,
		array(
			PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
		)
	);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $pdo;
}

?>
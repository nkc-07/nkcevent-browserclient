<?php
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
        $ret = getEventatPager($param);
        if ($ret['success']) {
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

function getEventatPager($param)
{
    $ret = [
        'success' => true,
        'msg' => "",
    ];

    try {
        if (empty($param['limit']))            throw new ErrorException($errmsg . "limit");

        $sql = "SELECT ROUND(COUNT(*) / :limit, 0) AS page_cunt
                FROM event e
                INNER JOIN member m
                ON e.organizer = m.member_id
                WHERE held_date >= CURDATE()";

        $stmt = PDO()->prepare($sql);
        $stmt->bindValue(':limit', $param['limit'], PDO::PARAM_INT);

        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $ret['data'] = $data;
    } catch (Exception $err) {
        //exceptionErrorPut($err, "EXCEPTION");
        $ret['success'] = false;
        $ret['msg'] = "[" . date("Y-m-d H:i:s") . "]" . $err->getMessage();
    }

    return $ret;
}

function generateSortSql($paramValues)
{
    if (array_key_exists('sort', $paramValues)) {
        switch ($paramValues['sort']) {
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

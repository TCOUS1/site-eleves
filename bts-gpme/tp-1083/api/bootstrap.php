<?php
declare(strict_types=1);
function gpme_json(array $data,int $status=200): never {http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function gpme_db(): PDO {
  if(!extension_loaded('pdo_sqlite')){throw new RuntimeException('Extension PHP pdo_sqlite absente.');}
  $dir=dirname(__DIR__).'/data'; if(!is_dir($dir))mkdir($dir,0775,true);
  $db=new PDO('sqlite:'.$dir.'/feedback.sqlite');$db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  $db->exec("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, resource_id TEXT NOT NULL, resource_title TEXT NOT NULL, section TEXT DEFAULT '', category TEXT NOT NULL, comment TEXT NOT NULL, page_url TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  return $db;
}
?>
<?php
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);
$pass = $input['password'];

//pass 1
if('MQ==' == $pass ){
echo '{"role" : "admin"}';
die();
}
//pass 2
if('Mg==' == $pass ){
echo '{"role" : "user"}';
die();
}


echo '{"role" : null}';
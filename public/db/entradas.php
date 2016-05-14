<?php

$data = json_decode(file_get_contents("php://input"));
$id = mysql_real_escape_string($data->id);
$canti = mysql_real_escape_string($data->canti);
$total = mysql_real_escape_string($data->total);
$conexion = mysqli_connect("localhost","root","","eshopper") or die("Error " . mysqli_error($conexion));// select the db name
mysql_query("INSERT INTO entradas (id,canti) VALUES ('$id', '$canti', '$total')"); 

?>
<?php

$conexion = mysqli_connect("localhost","root","1995","latexshop") or die("Error " . mysqli_error($conexion));// select the db name

$query = "SELECT * FROM playeras" or die("Error in the consult.." . mysqli_error($conexion)); 

$result = mysqli_query($conexion, $query);

$temp = array();

while($row = mysqli_fetch_array($result)) {
    $temp[] = $row;
}

echo json_encode($temp);
?>
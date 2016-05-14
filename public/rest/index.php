<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/db/productos', 'getProductos');
$app->get('/db/camisetas', 'getCamisetas');

$app->get('/wines', 'getWines');
$app->get('/wines/:id',	'getWine');
$app->get('/wines/search/:query', 'findByName');
$app->post('/wines', 'addWine');
$app->put('/wines/:id', 'updateWine');
$app->delete('/wines/:id',	'deleteWine');

$app->run();


function getProductos()
{
	$sql = "select * from db1.productos";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$productos = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($productos);

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getCamisetas()
{
	$sql = "select * from db1.camisetas";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$camisetas = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($camisetas);

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addProd() {
	
	$n = $_GET['n'];
	$p = $_GET['p'];
	$sql = "INSERT INTO `productos` (`nombre`, `precio`) VALUES ( '$n', '$p');";
	

	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		$db = null;
		echo json_encode(1); 

	} catch(PDOException $e) {
		
		echo json_encode(0); 
	}
}


function getEnepe() {
	$sql = "SELECT
  `tbl_dias`.`nombre` AS `dia`,
  `tbl_recintos`.`nombre` AS `recinto`,
  `tbl_horarios`.`nombre` AS `horario`,
  `tbl_tipos_contribucion`.`nombre` AS `tipo`,
  `tbl_congresistas`.`nombre` AS `autor`,
  `tbl_congresistas`.`apaterno`,
  `tbl_congresistas`.`amaterno`,
  `tbl_sedes`.`nombre` AS `sede`,
  `tbl_contribuciones`.`titulo` AS `titulo`,
  `tbl_contribuciones`.`ncn`
FROM
  `tbl_contribuciones`
  INNER JOIN `tbl_modulo_contribuciones`
    ON `tbl_modulo_contribuciones`.`contribucion` = `tbl_contribuciones`.`ncn`
  INNER JOIN `tbl_modulos` ON `tbl_modulo_contribuciones`.`modulo` =
    `tbl_modulos`.`nmd`
  INNER JOIN `tbl_recintos` ON `tbl_modulos`.`recinto` = `tbl_recintos`.`nrs`
  INNER JOIN `tbl_dias` ON `tbl_modulos`.`dia` = `tbl_dias`.`nda`
  INNER JOIN `tbl_horarios` ON `tbl_modulos`.`horario` = `tbl_horarios`.`nhr`
  INNER JOIN `tbl_sedes` ON `tbl_sedes`.`nsd` = `tbl_recintos`.`sede`
  INNER JOIN `tbl_congresistas` ON `tbl_congresistas`.`ncn` =
    `tbl_contribuciones`.`ncn`
  INNER JOIN `tbl_tipos_contribucion` ON `tbl_contribuciones`.`tpc` =
    `tbl_tipos_contribucion`.`tpc`
    
    where `tbl_tipos_contribucion`.`nombre` = 'Ponencia ENEPE'
    	
    ;";


    //$sql = "select * from comie.vwdatosactividades limit 20;";

	try {
		$db = getConnection();
		//$db->setAttribute(PDO::MYSQL_ATTR_MAX_BUFFER_SIZE, 1024 * 1024 * 10);
		//$stmt = $db->query($sql);  
		
		$stmt = $db->prepare($sql);  
		//$stmt->bindParam("id", $id);
		$stmt->execute();
		
		//$actividades = $stmt->fetchAll(PDO::FETCH_OBJ);
		//$actividades = $stmt->fetchAll(PDO::FETCH_ASSOC);
		

		//$actividades = mb_check_encoding($actividades, 'UTF-8') ? $actividades : utf8_encode($actividades);

		//while ($actividades = $stmt->fetch(PDO::FETCH_ASSOC)) {
    	//	echo $actividades['dia'];
 		//}

		
		
		$myfile = fopen("enepe.json", "w") or die("Unable to open file!");
		//$txt = "John Doe\n";
		//fwrite($myfile, $txt);
		//$txt = "Jane Doe\n";
		//fwrite($myfile, $txt);
		//fclose($myfile);		 
		

		
		
		//echo "[";
		fwrite($myfile, "[");

		$arr = $stmt->fetch(PDO::FETCH_OBJ);
		//echo json_encode($arr);
		fwrite($myfile, json_encode($arr));

		while ($arr = $stmt->fetch(PDO::FETCH_OBJ)) { 
    		
    		//echo "," . json_encode($arr);
    		//utf8_decode(string) htmlspecialchars($datos) htmlentities($str, null, "UTF-8");
    		if(json_encode($arr) != "")
    			fwrite($myfile, "," . utf8_encode(json_encode($arr)));
    			//fwrite($myfile, "," . json_encode($arr, null, "UTF-8"));
		}

		//echo "]";
		fwrite($myfile, "]");

		
		
		fclose($myfile);



		$myfile = fopen("enepe.json", "r") or die("Unable to open file!");
		echo fread($myfile, filesize("enepe.json"));
		fclose($myfile);

		$db = null;

		//echo json_encode($actividades);

		

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getActividades() {
	$sql = "SELECT
  `tbl_dias`.`nombre` AS `dia`,
  `tbl_recintos`.`nombre` AS `recinto`,
  `tbl_horarios`.`nombre` AS `horario`,
  `tbl_tipos_contribucion`.`nombre` AS `tipo`,
  `tbl_congresistas`.`nombre` AS `autor`,
  `tbl_congresistas`.`apaterno`,
  `tbl_congresistas`.`amaterno`,
  `tbl_sedes`.`nombre` AS `sede`,
  `tbl_contribuciones`.`titulo` AS `titulo`,
  `tbl_contribuciones`.`ncn`
FROM
  `tbl_contribuciones`
  INNER JOIN `tbl_modulo_contribuciones`
    ON `tbl_modulo_contribuciones`.`contribucion` = `tbl_contribuciones`.`ncn`
  INNER JOIN `tbl_modulos` ON `tbl_modulo_contribuciones`.`modulo` =
    `tbl_modulos`.`nmd`
  INNER JOIN `tbl_recintos` ON `tbl_modulos`.`recinto` = `tbl_recintos`.`nrs`
  INNER JOIN `tbl_dias` ON `tbl_modulos`.`dia` = `tbl_dias`.`nda`
  INNER JOIN `tbl_horarios` ON `tbl_modulos`.`horario` = `tbl_horarios`.`nhr`
  INNER JOIN `tbl_sedes` ON `tbl_sedes`.`nsd` = `tbl_recintos`.`sede`
  INNER JOIN `tbl_congresistas` ON `tbl_congresistas`.`ncn` =
    `tbl_contribuciones`.`ncn`
  INNER JOIN `tbl_tipos_contribucion` ON `tbl_contribuciones`.`tpc` =
    `tbl_tipos_contribucion`.`tpc`
    
    where `tbl_dias`.`nombre` like '%Miercoles%'; 
    or
    
    `tbl_dias`.`nombre` like 'Jueves%' or
    
    `tbl_dias`.`nombre` like 'Viernes%'
    ;";


    //$sql = "select * from comie.vwdatosactividades limit 20;";

	try {
		$db = getConnection();
		//$db->setAttribute(PDO::MYSQL_ATTR_MAX_BUFFER_SIZE, 1024 * 1024 * 10);
		//$stmt = $db->query($sql);  
		
		$stmt = $db->prepare($sql);  
		//$stmt->bindParam("id", $id);
		$stmt->execute();
		
		//$actividades = $stmt->fetchAll(PDO::FETCH_OBJ);
		//$actividades = $stmt->fetchAll(PDO::FETCH_ASSOC);
		

		//$actividades = mb_check_encoding($actividades, 'UTF-8') ? $actividades : utf8_encode($actividades);

		//while ($actividades = $stmt->fetch(PDO::FETCH_ASSOC)) {
    	//	echo $actividades['dia'];
 		//}

		
		
		$myfile = fopen("newfile.json", "w") or die("Unable to open file!");
		//$txt = "John Doe\n";
		//fwrite($myfile, $txt);
		//$txt = "Jane Doe\n";
		//fwrite($myfile, $txt);
		//fclose($myfile);		 
		

		
		
		//echo "[";
		fwrite($myfile, "[");

		$arr = $stmt->fetch(PDO::FETCH_OBJ);
		//echo json_encode($arr);
		fwrite($myfile, json_encode($arr));

		while ($arr = $stmt->fetch(PDO::FETCH_OBJ)) { 
    		
    		//echo "," . json_encode($arr);
    		if(json_encode($arr) != "")
    			fwrite($myfile, "," . utf8_encode(json_encode($arr)));
    			//fwrite($myfile, "," . json_encode($arr));
		}

		//echo "]";
		fwrite($myfile, "]");

		
		
		fclose($myfile);


		$myfile = fopen("newfile.json", "r") or die("Unable to open file!");
		echo fread($myfile, filesize("newfile.json"));
		fclose($myfile);

		$db = null;

		//echo json_encode($actividades);

		

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}




function getWines() {
	$sql = "select * FROM wine ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getWine($id) {
	$sql = "SELECT * FROM wine WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$wine = $stmt->fetchObject();  
		$db = null;
		echo json_encode($wine); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addWine() {
	error_log('addWine\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$wine = json_decode($request->getBody());
	$sql = "INSERT INTO wine (name, grapes, country, region, year, description) VALUES (:name, :grapes, :country, :region, :year, :description)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $wine->name);
		$stmt->bindParam("grapes", $wine->grapes);
		$stmt->bindParam("country", $wine->country);
		$stmt->bindParam("region", $wine->region);
		$stmt->bindParam("year", $wine->year);
		$stmt->bindParam("description", $wine->description);
		$stmt->execute();
		$wine->id = $db->lastInsertId();
		$db = null;
		echo json_encode($wine); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateWine($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$wine = json_decode($body);
	$sql = "UPDATE wine SET name=:name, grapes=:grapes, country=:country, region=:region, year=:year, description=:description WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $wine->name);
		$stmt->bindParam("grapes", $wine->grapes);
		$stmt->bindParam("country", $wine->country);
		$stmt->bindParam("region", $wine->region);
		$stmt->bindParam("year", $wine->year);
		$stmt->bindParam("description", $wine->description);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($wine); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteWine($id) {
	$sql = "DELETE FROM wine WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM wine WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	
	
	$dbuser="root";
	$dbpass="root";
	$dbname="db1";
	$dbhost="localhost";
	
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname; charset=utf8", $dbuser, $dbpass);	
	
	$dbh->exec("set names utf8");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);
	//$dbh->setAttribute(PDO::MYSQL_ATTR_MAX_BUFFER_SIZE=>16777216);
	
	
	return $dbh;
}

?>
var tienda = angular.module('tienda', []);


tienda.config(function($routeProvider) {
  $routeProvider
          .when('/', 
                    {
                      templateUrl: 'views/home.html'
                      ,controller: 'home'                      
                    }
              )
          .when('/detalle/:id', 
                    {
                      controller:  'detalle',
                      templateUrl: 'views/detalle.html'
                    })

          .when('/car', 
                    {
                      controller:  'car',
                      templateUrl: 'views/car.html'
                    })
          
          .otherwise({ redirectTo: '/' });
});


// Definicion de clases


var Entrada = function()
          {
            this.producto = {};
            this.canti = 0;
          }  

          Entrada.prototype.getImporte = function() {
            return this.canti * this.producto.precio;
          }

          Entrada.prototype.increCanti = function() {
            return this.canti++;
          }

          Entrada.prototype.decreCanti = function() {
            if(this.canti>=2){
              return this.canti--;  
            }
            
          }

          Entrada.prototype.setCanti = function(n) {
            if(this.canti<=0){
              alert("Ingresa una cantidad valida.");
              this.canti=1;
            }else{
              return this.canti = n;  
            }
            
          }



//-----------------------------------

tienda.factory("global",
  function($rootScope, $http)
  {
    var obj = {};

    // in not session
    obj.productos = [];
    obj.camisetas = [];
    

    // in session
    obj.entradas = [];


    obj.addToCar = function(e)
    {

        var tmp = new Entrada();
        angular.copy(e, tmp);
        
        $http.get("db/entradas").success(
          function(data)
          { 
            if(true)
            {
              obj.entradas.push(tmp); 
              $rootScope.$broadcast("addToCar");
            }
            
          }
        );           
    }

    obj.delToCar = function(nom)
    {

        for (var i = 0; i < obj.car.length; i++) {
          if(obj.car[i].nombre == nom)
          {

            $http.get("db/entradas").success(
              function(data)
              { 
                if(true)
                obj.car.splice(1, i); 
                $rootScope.$broadcast("addToCar");
              }
            ); 

            break;
          }
        };
                  
    }

    obj.getCamisetas = function()
    {

      if(obj.productos.length > 0)
        $rootScope.$broadcast("getCamisetas");
      else
        $http.get("db/playeras.php").success(
          function(data)
          {
            obj.camisetas = data;
            $rootScope.$broadcast("getCamisetas");
          }
        );
    }

    obj.getProductos = function()
    {

      if(obj.productos.length > 0)
        $rootScope.$broadcast("getProductos");
      else
        $http.get("db/productos").success(
          function(data)
          {
            obj.productos = data;
            $rootScope.$broadcast("getProductos");
          }
        );
    }

    obj.getProducto = function(id)
    {
      for (var i = 0; i < obj.productos.length; i++) {
        if(obj.productos[i].id == id)        
          return obj.productos[i];
      };
    }

    obj.getEntradas = function()
    {
      
      if(obj.productos.length > 0)
        $rootScope.$broadcast("getEntradas");
      else
        $http.get("db/entradas").success(
          function(data)
          {
            for (var i = 0; i < data.length; i++) {
              var tmp = new Entrada();
              angular.copy(data[i], tmp);
              obj.entradas.push(tmp);
            };
            
            $rootScope.$broadcast("getEntradas");
          }
        );
    }

obj.postEntradas = function()
    {
        $http.post("db/entradas.php",{'id': $scope.prod.id, 'canti': 1, 'total': $scope.getImporte})
        .success(function(data, status, headers, config){
            console.log("inserted Successfully");
        });
    }
    return obj;
  }
);

function main($scope, global)
{
  console.log("main");

  $scope.entradas = global.entradas;

  $scope.$on("addToCar", 
    function()
    {
      $scope.car = global.entradas;
    }
  );	
}


function car($scope, global)
{
  console.log("car");

  $scope.lista = global.getEntradas();


  $scope.$on("getEntradas", 
    function()
    {
      $scope.lista = global.entradas;
    }
  );
  
  $scope.addToCar = function(e){
        
    global.addToCar(e);
  }
}


function detalle ($scope, $routeParams, $location, global)
{
  $scope.id = $routeParams.id;
  $scope.prod = global.getProducto($scope.id);  

  if( !$scope.prod )
    $location.path('/');


  $scope.addToCar = function(e)
  {
    global.addToCar(e);
  }

}


function home($scope, $http, global)
{
  console.log("home");
	
  $scope.$on("getProductos", 
    function()
    {
      $scope.productos = global.productos;
      
    }
  );


  $scope.$on("getCamisetas", 
    function()
    {
      $scope.camisetas = global.camisetas;
    }
  );

  $scope.productos = [];
  $scope.camisetas = [];


  global.getProductos();
  global.getCamisetas();


}

tienda.controller("main", main);
tienda.controller("car", car);
tienda.controller("home", home);
tienda.controller("detalle", detalle);


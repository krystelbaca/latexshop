var tienda = angular.module('tienda', []);


tienda.config(function($routeProvider) {
  $routeProvider
          .when('/',
                    {
                      templateUrl: '/views/home.ejs'
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
            if(this.cantia<=0){
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
    obj.gorras=[];
    obj.cases=[];


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
      console.log("algo");
      $http.get('/find/productos/playeras').success(function(data) {
            return data;
        }).error(function(data){
          //TODO:Error
          });
        $rootScope.$broadcast("getCamisetas");

    }

    obj.getGorras = function()
    {
      console.log("algo");
      $http.get('/find/productos/gorras').success(function(data) {
            return data;
        }).error(function(data){
          //TODO:Error
          });
        $rootScope.$broadcast("getGorras");

    }

    obj.getCases = function()
    {
      console.log("algo");
      $http.get('/find/productos/cases').success(function(data) {
            return data;
        }).error(function(data){
          //TODO:Error
          });
        $rootScope.$broadcast("getCases");

    }
    obj.getProductos = function()
    {

      if(obj.productos.length > 0)
        $rootScope.$broadcast("getProductos");

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

function main($scope, global, $http)
{
  console.log("main");

  $scope.entradas = global.entradas;
  $scope.cartProducts =[];
  $scope.idUsuario;
  $scope.totalCarro = 0.0;
  $scope.productos =[];

  $scope.init = function(idUsuario){
    $scope.idUsuario = idUsuario;
    $scope.getProductosCarritos();
    $scope.getProductosTienda();
  };

  $scope.$on("addToCar",
    function()
    {
      $scope.car = global.entradas;
    }
  );

  $scope.getProductosCarritos = function(){
    if($scope.idUsuario!=="")
      $http.get('/find/cart/'+$scope.idUsuario).success(function(data) {
            var newProducts = [];
            if(data!=[]){
            data.productos.forEach(function(productoFormal) {
                var filteredProduct = {};
                filteredProduct.productName = productoFormal.productName;
                filteredProduct.price = productoFormal.productPrice;
                filteredProduct.cantidad = 0;
                filteredProduct.talla = productoFormal.talla;
                data.productos.forEach(function(productArray){
                  if((productoFormal.productName === productArray.productName) && (productoFormal.talla === productArray.talla)){
                    filteredProduct.cantidad +=1;
                  }
                });
                filteredProduct.total = filteredProduct.cantidad * filteredProduct.price;
                if(newProducts.length <=0){
                  newProducts.push(filteredProduct);
                } else {
                  if(
                    newProducts.filter(function(product){return (product.productName === filteredProduct.productName) && (product.talla === filteredProduct.talla)
                  }).length <=0){
                    newProducts.push(filteredProduct);
                  };
                }
                $scope.totalCarro +=productoFormal.productPrice;
            });
            $scope.cartProducts = newProducts;
            }
        }).error(function(data){
          //TODO:Error
          });
  }

  $scope.getProductosTienda = function(){
      $http.get('/find/productos/playeras').success(function(data) {
            $scope.productos = data;
            console.log(data);
        }).error(function(data){
          //TODO:Error
          });
  }



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
      console.log("Algo");
      $http.get('/find/productos/playeras').success(function(data) {
            $scope.camisetas = data;
            console.log(data);
        }).error(function(data){
          //TODO:Error
          });
    }
  );

  $scope.$on("getGorras",
    function()
    {
      console.log("Algo");
      $http.get('/find/productos/gorras').success(function(data) {
            $scope.gorras = data;
        }).error(function(data){
          //TODO:Error
          });
    }
  );

  $scope.$on("getCases",
    function()
    {
      console.log("Algo");
      $http.get('/find/productos/cases').success(function(data) {
            $scope.cases = data;
            console.log(data);
        }).error(function(data){
          //TODO:Error
          });
    }
  );

  $scope.gorras = [];
  $scope.camisetas = [];
  $scope.cases=[];


  global.getGorras();
  global.getCases();
  global.getCamisetas();


}

tienda.controller("main", main);
tienda.controller("car", car);
tienda.controller("home", home);
tienda.controller("detalle", detalle);

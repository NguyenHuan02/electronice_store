app.controller("productCtrl",
    function($scope, $routeParams, $rootScope) {
        $scope.id = $routeParams.id; //Lấy ra id của sản phẩm

        $scope.qty = 1
        $rootScope.products.$loaded().then(function(products) {
            $scope.product = $rootScope.products.find(x => x.id == $scope.id); //lấy ra sp từ mảng
            $scope.prods = $rootScope.products.slice() //sao chép mảng từ Firebase
            $scope.prods.sort(() => Math.floor(Math.random() * 2) - 1); //sắp xếp ngẫu nhiên
        });

        //Thêm sp vào giỏ hàng với số lượng tương ứng
        $scope.addProduct = () => {
            $rootScope.addToCart($scope.product, Number($scope.qty))
        }

    });
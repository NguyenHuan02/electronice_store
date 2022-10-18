app.controller("storeCtrl", ["$scope", "$firebaseArray", "$rootScope", "$routeParams",
    function($scope, $firebaseArray, $rootScope, $routeParams) {
        $scope.idFilter = $routeParams.id; //danh mục hoặc thương hiệu mặc định

        $scope.begin = 0; //STT bắt đầu mỗi trang
        $scope.row = '9'; //Số SP mỗi trang
        $scope.order = 'name'; //Sắp xếp theo tiêu chí
        $scope.prods = []; //Mảng sản phẩm sau filter
        $scope.brandsList = []; //Mảng thương hiệu đc lọc
        $scope.categoriesList = []; //Mảng danh mục đc lọc
        $scope.keyword = $routeParams.keyword; //Từ khóa tìm kiếm
        $scope.minPrice = 1; //Giá thấp nhất
        $scope.maxPrice = 60000; //Giá cao nhất


        //Xử lý tải sản phẩm lúc chạy , tự động đánh dấu filter đc truyền và tiến hành lọc
        $rootScope.products.$loaded().then(function(products) {
            for (let index = 0; index < $rootScope.brands.length; index++) {
                if ($scope.idFilter == $rootScope.brands[index].name) $scope.brandsList[index] = true
            }
            for (let index = 0; index < $rootScope.categories.length; index++) {
                if ($scope.idFilter == $rootScope.categories[index].name) $scope.categoriesList[index] = true
            }
            $scope.check()
        });

        //Bộ lọc
        $scope.storeFilter = () => {
            $rootScope.products.$loaded() //Đợi tải dữ liệu từ Firebase
                .then(function() {
                    $scope.prods = $rootScope.products.slice() //sao chép mảng từ Firebase

                    //Lọc lần 1 : lọc bởi thương hiệu
                    $scope.prods = $scope.prods.filter(x => {
                        if ($scope.brandsList.indexOf(true) < 0) return true
                        for (let index = 0; index < $scope.brandsList.length; index++) {
                            if ($scope.brandsList[index] && x.brandId == $rootScope.brands[index].name) return true;
                        }
                        console.log(x)
                        return false
                    })

                    //Lọc lần 2 : lọc bởi danh mục
                    .filter(x => {
                        if ($scope.categoriesList.indexOf(true) < 0) return true
                        for (let index = 0; index < $scope.categoriesList.length; index++) {
                            if ($scope.categoriesList[index] && x.categoryId == $rootScope.categories[index].name) return true;
                        }
                        console.log(x)
                        return false
                    })

                    //Lọc lần 3 : lọc bởi khoảng giá
                    .filter(x => {
                        if (x.price >= $scope.minPrice * 1000 && x.price <= $scope.maxPrice * 1000) return true
                        return false
                    })

                    //Lọc lần 4 : lọc bởi từ khóa tìm kiếm
                    .filter(x => {
                        if ($scope.keyword == '' || !$scope.keyword) return true
                        if ((x.name.toLowerCase()).includes($scope.keyword.toLowerCase())) return true
                        return false
                    })

                }).then(() => {
                    $scope.getPageCount()
                })
        }

        //Tạo chỉ mục cho trang
        $scope.getPageCount = function() {
            $rootScope.pageCount = Math.ceil($scope.prods.length / $scope.row);

            $scope.pages = []
            for (let index = 1; index <= $scope.pageCount; index++) {
                $scope.pages.push(index)
            }
        }

        //Click checkbox và đợi đồng bộ 0.5s trước khi thực hiện lọc
        $scope.check = (x) => {
            setTimeout(() => {
                $scope.storeFilter()
            }, 500);
        }

        //Đặt lại số trang , về trang đầu tiên
        $scope.resetPage = () => {
            $scope.begin = 0;
            $scope.getPageCount()
        }

        //Về trang đầu tiên
        $scope.first = function() {
            $scope.getPageCount();
            $scope.begin = 0;
        }

        //Đến trang được chọn
        $scope.clickPage = function(page) {
            $scope.getPageCount();
            $scope.begin = $scope.row * (page - 1);
        }

        //Đến trang cuối
        $scope.last = function() {
            $scope.getPageCount();
            $scope.begin = ($scope.pageCount - 1) * $scope.row;
        }
    }
]);
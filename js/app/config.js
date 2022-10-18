var app = angular.module("ElectroApp", ["firebase", "ngRoute", "ngAnimate"]);
app.config(function($routeProvider) {
    var config = {
        apiKey: "AIzaSyBGYDd8fe_jMFuIFJK9qzVQ23odUmCsCBk",
        authDomain: "electro-286b5.firebaseapp.com",
        databaseURL: "https://electro-286b5-default-rtdb.firebaseio.com",
        storageBucket: "electro-286b5.appspot.com"
    };
    firebase.initializeApp(config);

    $routeProvider
        .when("/home", {
            templateUrl: "home.html",
            controller: "cartCtrl"
        })
        .when("/about_us", {
            templateUrl: "about_us.html"
        })
        .when("/contact_us", {
            templateUrl: "contact_us.html"
        })
        .when("/cart", {
            templateUrl: "cart.html"
        })
        .when("/checkout", {
            templateUrl: "checkout.html",
            controller: "cartCtrl"
        })
        .when("/faq", {
            templateUrl: "faq.html"
        })
        .when("/store", {
            templateUrl: "store.html",
            controller: "storeCtrl"
        })
        .when("/store/:id", {
            templateUrl: "store.html",
            controller: "storeCtrl"
        })
        .when("/store/:id/:keyword", {
            templateUrl: "store.html",
            controller: "storeCtrl"
        })
        .when("/product/:id", {
            templateUrl: "product.html",
            controller: 'productCtrl'
        })
        .when("/account/login", {
            templateUrl: "login.html",
            controller: 'accountCtrl'
        })
        .when("/account/register", {
            templateUrl: "register.html",
            controller: 'accountCtrl'
        })
        .when("/account/logout", {
            templateUrl: "login.html",
            controller: 'accountCtrl'
        })
        .when("/account/forgotpassword", {
            templateUrl: "forgotpassword.html",
            controller: 'accountCtrl'
        })
        .when("/account/changepassword", {
            templateUrl: "change_pass.html",
            controller: 'accountCtrl'
        })
        .otherwise({
            redirectTo: "/home"
        })

});

app.run(function($rootScope) {
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.loading = true;
    })
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loading = false;
    })
    $rootScope.$on('$routeChangeError', function() {
        $rootScope.loading = false;
        alert("Lỗi , không tải được template")
    })
})

app.controller("rootCtrl", ["$scope", "$firebaseArray", "$rootScope", "$firebaseAuth",
    function($scope, $firebaseArray, $rootScope, $firebaseAuth) {
        //Hàm lấy dữ liệu firebase
        $rootScope.getData = table => {
            var ref = firebase.database().ref(table);
            return $firebaseArray(ref);
        }
        $rootScope.category1 = 'all'
        $rootScope.keyword = ''
        $rootScope.categories = $rootScope.getData("Categories")
        $rootScope.brands = $rootScope.getData("Brands")
        $rootScope.products = $rootScope.getData("Products")
        $rootScope.accounts = $rootScope.getData("Accounts")
        $rootScope.orders = $rootScope.getData("Orders")

        $rootScope.account = JSON.parse(localStorage.getItem("account"));
        if (!$rootScope.account) {
            $rootScope.account = null
            localStorage.removeItem("account")
        }

        $rootScope.logged = link => {
            if (!$rootScope.account) {
                Swal.fire({
                    icon: 'error',
                    title: 'Chưa đăng nhập',
                    text: 'Vui lòng đăng nhập để tiếp tục',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                document.location.href = link;
            }
        }

        var countDownDate = new Date("May 17, 2030 15:37:25").getTime();
        setInterval(function() {

            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            document.getElementById("days").innerHTML = 2;
            document.getElementById("hours").innerHTML = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerHTML = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerHTML = Math.floor((distance % (1000 * 60)) / 1000);

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("demo").innerHTML = "EXPIRED";
            }
        }, 1000);
    }
]);
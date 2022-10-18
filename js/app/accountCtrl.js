app.controller("accountCtrl", ["$scope", "$firebaseArray", "$firebaseAuth", "$rootScope",
    function($scope, $firebaseArray, $firebaseAuth, $rootScope) {
        $rootScope.authObj = $firebaseAuth();

        $rootScope.accounts.$loaded() //Đợi tải danh sách tài khoản từ Fisebase

        //Bắt đầu bộ đếm thời gian, sau 4s về lại trang chủ
        $scope.startTimer = (mess) => {
            var time = 4;
            $scope.success = true
            $scope.error = ''
            document.getElementById('time').innerHTML = mess
            var timer = setInterval(function() {
                time--;
                document.getElementById('time').innerHTML = "Chuyển trang trong " + time + " nữa"
                if (time == 0) {
                    document.location.href = '#!home';
                    clearInterval(timer);
                    $scope.success = ''
                }
            }, 1000);
        }

        //Kiểm tra đăng nhập
        //Thông báo lỗi khi thất bại
        //Thông báo khi thành công và về trang chủ trong 4s
        $rootScope.checkLogin = () => {
            $rootScope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
                //Chạy khi đăng nhập thành công

                $rootScope.account = $rootScope.isEmailExist() //lấy thông tin tài khoản đăng nhập từ danh sách
                localStorage.setItem("account", JSON.stringify($rootScope.account)) //lưu thông tin tài khoản vào localStorage
            }).then(() => {
                $scope.startTimer("Đăng nhập thành công") //Bắt đầu bộ đếm về trang chủ
            }).catch(function(error) {
                //Chạy khi thông tin tài khoản không chính xác ,hiển thị thông báo lỗi
                $scope.error = error.message
            });
        }

        //Kiểm tra đăng kí
        //Thông báo lỗi khi thất bại
        //Thông báo khi thành công và về trang chủ trong 4s
        $rootScope.checkRegister = () => {
            $scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
                .then(function(firebaseUser) {
                    //Chạy khi đăng kí thành công

                    var user = {
                        "email": $scope.email,
                        "name": $scope.username,
                        "password": $scope.password
                    }
                    console.log(user)

                    //Thêm thông tin tài khoản mới vào bảng Accounts trên Firebase
                    $rootScope.accounts.$loaded().then(function(x) {
                        $rootScope.accounts.$add(user).then(function(ref) {
                            var id = ref.key;
                            console.log("added record with id " + id);
                            $rootScope.account = $rootScope.isEmailExist() //lấy thông tin tài khoản đăng nhập từ danh sách
                            localStorage.setItem("account", JSON.stringify($rootScope.account)) //lưu thông tin tài khoản vào localStorage
                        });
                    })
                    $scope.startTimer("Đăng kí thành công")
                }).catch(function(error) {
                    //Chạy khi đăng kí xảy ra lỗi ,hiển thị thông báo lỗi
                    $scope.error = error.message
                });
        }

        //Kiểm tra đăng kí
        //Thông báo lỗi khi thất bại
        //Thông báo khi thành công và về trang chủ trong 4s
        $rootScope.changePass = () => {
            if ($scope.password2 != $scope.confirm) {
                $scope.error = "Nhập lại mật khẩu không khớp"
                return
            }
            $rootScope.authObj.$signInWithEmailAndPassword($rootScope.account.email, String($scope.password1)).then(() => {
                $scope.authObj.$updatePassword($scope.password2).then(function() {
                    document.getElementById('time').innerHTML = "Đổi mật khẩu thành công"
                })
            }).catch(function(error) {
                console.log(error.message)
                $scope.error = error.message
            });


        }

        //Quên mật khẩu
        $scope.forgot = () => {
            $scope.authObj.$sendPasswordResetEmail($scope.email).then(function() {
                $scope.success = true
                document.getElementById('time').innerHTML = "Password reset email sent successfully!"
            }).catch(function(error) {
                $scope.error = error.message
            });
        }

        //Đăng xuất 
        $rootScope.logOut = () => {
            $rootScope.authObj.$signOut() //Đăng xuất trên máy khách
            $rootScope.account = null //Xóa thông tin tài khoản hiện tại
            localStorage.removeItem("account") //Xóa thông tin tài khoản khỏi local storage
            console.log("SignOut")
        }

        $rootScope.isEmailExist = () => {
            return $rootScope.accounts.find(acc => acc.email === $scope.email) //Trả về tài khoản khớp với $scope.email
        }
    }
]);
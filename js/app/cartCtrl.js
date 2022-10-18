app.controller("cartCtrl", ["$scope", "$firebaseArray", "$rootScope",
    function($scope, $firebaseArray, $rootScope) {
        //Tính toán giỏ hàng
        $rootScope.calculatorCart = () => {
            $rootScope.cartQuantity = $rootScope.cart.length //số loại sp trong giỏ hàng

            $rootScope.total = 0 //Tổng số tiền hàng ước tính trong giỏ hàng
            $rootScope.cart.forEach(item => {
                $rootScope.total += item.quantity * (item.product.price - (item.product.price * item.product.sale / 100))
            });
        }

        //Đợi dữ liệu từ firebase và tải giỏ hàng từ localStorage
        $rootScope.products.$loaded().then(function(products) {
            if (localStorage.getItem("cart")) {
                $rootScope.cart = Array.from(JSON.parse(localStorage.getItem("cart")));
            } else {
                $rootScope.cart = []
            }
            $rootScope.calculatorCart();
        });

        //Thêm vào giỏ hàng
        $rootScope.addToCart = (obj, qty) => {
            //Số lượng mặc định là 1 nếu k có tham số
            if (!qty) qty = 1

            //Lấy index sản phẩm trong giỏ hàng
            var index = $rootScope.cart.findIndex(item => {
                return (item.product.$id == obj.$id)
            })

            //Thêm mới nếu sản phẩm không tồn tại hoặc tăng số lượng nếu sản phẩm đã tồn tại
            if (index < 0) {
                var cartItem = {
                    product: obj,
                    quantity: qty
                }
                $rootScope.cart.push(cartItem)
            } else {
                $rootScope.cart[index].quantity += qty
            }

            $rootScope.calculatorCart();
            localStorage.setItem("cart", JSON.stringify($rootScope.cart));
        }

        //Đặt số lượng sp vào giỏ hàng
        $rootScope.setQuantityProductInCart = (cartItem, qty) => {
            //Số lượng mặc định là 1 nếu k có tham số
            if (!qty) qty = 1

            //Lấy index sản phẩm trong giỏ hàng
            var index = $rootScope.cart.findIndex(item => {
                return (item.product.$id == cartItem.product.$id)
            })
            console.log(index)

            $rootScope.cart[index].quantity = qty

            $rootScope.calculatorCart();
            localStorage.setItem("cart", JSON.stringify($rootScope.cart));
        }

        //Xóa khỏi giỏ hàng
        $rootScope.removeFromCart = (obj) => {
            $rootScope.cart.splice($rootScope.cart.indexOf(obj), 1)

            $rootScope.calculatorCart();
            localStorage.setItem("cart", JSON.stringify($rootScope.cart));
        }

        //Làm trống giỏ hàng
        $rootScope.clearCart = (obj) => {
            localStorage.removeItem("cart")
        }

        $rootScope.doOrder = (obj) => {
            var order = {
                "account": $rootScope.account,
                "products": $rootScope.cart
            }
            $rootScope.orders.$add(order)
            $rootScope.clearCart()
        }
    }
]);
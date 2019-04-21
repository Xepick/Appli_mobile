var SignupApp = angular.module('SignupApp', []);

function mainController($scope, $http, $window) {

    $scope.sendData= function(){
        console.log($scope.username);
        console.log($scope.password)
        console.log("SendData Triggered")
        $http.post('http://localhost:8081/Signup/'+$scope.username+'/'+$scope.password).success(function (cb) {
            console.log("Succesfully POST le cookie /");
            console.log(cb)
            if (cb == 'OK') {
                $window.location.href = "/";
            }
        })
            .error(function () {
                alert("USERNAME ALREADY TAKEN");
                console.log("Error");
            })
    }
};
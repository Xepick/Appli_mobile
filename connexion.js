var appConnexion = angular.module('appConnexion', []);

function mainController($scope, $http, $window){

    $http.get('/ListeUser').success(function(data) {
        console.log("Sucess ListeUser ?");
        $scope.laliste = data;
    })
    .error(function(data) {
        console.log('Error ListeUser : ' + data);
    });

    $scope.connect= function() {
    
        //console.log($scope.myId);
        //console.log($scope.myPassword);
        $http.post('/login/'+$scope.myId+'/'+$scope.myPassword).success(function(cb) {
            console.log("Succesfully POST le cookie /");
                console.log(cb);
                if(cb=='OK')
                {
                    $window.location.href="/AfficheToutesListes";
                }
            })
        .error(function(){
            alert('Username/Password Invalid');
            console.log("Error");
        })
    }

    $scope.createAccount= function(){
        $window.location.href='/CreateAcc';
      }


}
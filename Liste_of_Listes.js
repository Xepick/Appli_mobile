var Listeafaire = angular.module('totoList', []);

function mainController($scope, $http, $window) {
    $scope.formData = {};
    $scope.formModify = {};
    $scope.ListeofLists=[];
    $scope.ListeofLists.name = {};
    $scope.NouvelleListe;
    $http.get('/getNomToutesListes').success(function(data){
        console.log(data);
        for(var i=0; i<data.length; i++){
            //console.log(data[i]);
            $scope.ListeofLists[i] = data[i];
           //console.log($scope.ListeofLists);

        }
        console.log($scope.ListeofLists);
    }).error(function(data){
        console.log('Error ListeofLists' + data);
    });

    $scope.goToListe = function(nom) {
        console.log(nom);
            $http.get('/getMyNomDeListe/'+nom).success(function(data){
                console.log(data);
                if(data ==='OK')
                {
                    console.log("Je vais vers /ListeUser")
                    $window.location.href='/AfficheListe';
                }
            });
    }

    $scope.createListe = function() {
        if($scope.NouvelleListe!=="")
        {
            $http.get('/getMyNomDeListe/'+$scope.NouvelleListe).success(function(data){
                console.log(data);
                if(data ==='OK')
                {
                    console.log("Je vais vers /ListeUser")
                    $window.location.href='/AfficheListe';
                }
            });
        }
        console.log("Erreur, remplissez le champ");
    }


    //deletion d'une liste 
    
    $scope.deleteListe = function(nom) {
        $http.post('/deleteListe/'+nom).success(function(data){
            console.log(data);
            if(data=='OK')
            {
                $scope.ListeofLists={};
                $http.get('/getNomToutesListes').success(function(data){
                    console.log(data);
                    for(var i=0; i<data.length; i++){
                        console.log(data[i]);
                        $scope.ListeofLists[i] = data[i];
                        //console.log($scope.ListeofLists);
                    }
                    console.log($scope.ListeofLists);
                }).error(function(data){
                    console.log('Error ListeofLists' + data);
                });
            }
        }).error(function(data){
            console.log('Error Create new Liste' +data);
        });
    } 
       
}
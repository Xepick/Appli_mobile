var Listeafaire = angular.module('RoflList', []);

function mainController($scope, $http, $window) {
    $scope.formData = {};
    $scope.formModify = {};
    $scope.laliste = {};

    //Obtenir la liste (appel à la fonction get dans server.js)
 
    $http.get('/ListeUser').success(function(data) {
            console.log("Sucess ListeUser ?");
           // console.log(data);
            $scope.laliste = data;
        })
        .error(function(data) {
            console.log('Error ListeUser : ' + data);
        });

    //rajout d'une tâche (appel à la fonction post dans server.js)
    $scope.createTodo = function() {
        $http.post('/ListeCreate', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.laliste = data;
               // console.log(data);
            })
            .error(function(data) {
                //console.log($scope.formData);
                console.log('Error ListeCreate : ' + data);
            }); 
            console.log("J'ai create le todo");
    };

    //Modification d'une tâche : 
    $scope.modifyTodo = function(task, index) {
        if (document.getElementById('btn-modify-'+index).innerHTML=='Modifier') {
            for(var i = 0; i < $scope.laliste.length; i++) {
                affichageNormal_Modify(i);
            }
            document.getElementById('xtextmodify-'+index).style.display = "block";
            document.getElementById('xtext-'+index).style.display = "none";
            document.getElementById('btn-modify-'+index).innerHTML='✔';
            $scope.formModify.text = task.text;
        }
        else {
            affichageNormal_Modify(index);
            $http.post('/Liste/modify/' + task._id + "/" + $scope.formModify.text)
            .success(function(data) {
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error modify ' + data);
            });
        };
};

    //suppression d'une tâche (appel à la fonction delete dans server.js)
    $scope.deleteTodo = function(id) {
        console.log(id);
        console.log("saut");
        $http.post('/List/delete/' + id)
            .success(function(data) {
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error liste delete : ' + data);
            }); 
    };

    //suppression d'une tâche (appel à la fonction delete dans server.js)
    $scope.retourListes = function() {
        $window.location.href="/AfficheToutesListes";
    };

    // Permet de déclarer une tâche "effectuée" : 
    $scope.checkTodo = function(id, done, index) {
        //console.log("Valeur de done dans checkTodo :"+done);
        $http.post('/Liste/' + id + "/" + done)
            .success(function(data) {
                $scope.formData = {};
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error liste done : ' + data);
            }); 
    }

        //OK DONE
    $scope.taskDone = function(done) {
        //console.log("Passe dans taskDone pour le CSS et value=" +done);
        if(done==true)
        {
            $scope.Style={
                "background-color" : "lightgray"
            }
            //console.log($scope.Style);
            return $scope.Style;
        }
        else
        {
            $scope.Style={
                "background-color" : "red"
            }
            //console.log($scope.Style);
            return $scope.Style;
        }
            
    }

    //Supprime les tâches "finies" : 
    $scope.delCheckedTask = function() {
        for(i in $scope.laliste) {
            if($scope.laliste[i].done) {
                $http.post('/List/delete/' + $scope.laliste[i]._id)
                    .success(function(data) {
                        $scope.laliste = data;
                    })
                    .error(function(data) {
                        console.log('Error liste delete : ' + data);
                    }); 
            }
        }
    }

    function affichageNormal_Modify(index) {
        document.getElementById('xtextmodify-'+index).style.display = "none";
        document.getElementById('xtext-'+index).style.display = "block";
        document.getElementById('btn-modify-'+index).innerHTML = 'Modifier';
    }
}
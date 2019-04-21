var routerListe = require('express').Router();
var dataLayerListe = require('./dataLayerListe');

var MongoClient = require("mongodb").MongoClient;
var uri = "mongodb+srv://Xenon:batman2010@cluster0-arabs.mongodb.net/AppListe?retryWrites=true";

var nomNouvelleListe;

var cors = require('cors');

// use it before all route definitions
routerListe.use(cors({ origin: 'http://localhost:8100' }));

// Partie gestion cookie :

var userConnected;

routerListe.get('/', function (req, res) {
    res.sendFile(__dirname + '/connexion.html');
});

routerListe.post('/login/:username/:password', function (req, res) {
    dataLayerListe.checkUser(req.session, req.params.username, req.params.password, function (codeEchange) {
        userConnected = req.params.username;

        res.sendStatus(codeEchange);
    });
});

//
routerListe.get('/createListe/:nomListe', function (req, res) {
    nomNouvelleListe = req.params.nomListe;
    res.sendStatus(200);
});

routerListe.get('/AfficheToutesListes', function (req, res) {
    if (req.session.username !== undefined || userConnected !== undefined)
        res.sendFile(__dirname + '/Liste_of_Listes.html');
    else
        res.sendStatus(403);
});

// Pour afficher le nom de toute les listes
routerListe.get('/getNomToutesListes', function (req, res) {
    if (req.session.username !== undefined) {
        dataLayerListe.afficheListeName(req.session.username, function (cb) {
            console.log(cb)
            res.json(cb);
        });
    }
    else
        if (userConnected !== undefined) {
            dataLayerListe.afficheListeName(userConnected, function (cb) {

                // console.log("L'user"+userConnected+" récupère ses listes :");
                //console.log(cb);
                res.json(cb);
            });
        }
        else {
            res.sendStatus(403);
        }
});

// Ajouter une liste
routerListe.post('/ListeCreate', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.body) {
        console.log(nomNouvelleListe);
        if (req.session.username !== undefined) {
            console.log("Je suis dans ListeCreate");
            //console.log(req.session.username);
            var dataToInsert = {
                text: req.body.text,
                date: Date.now(),
                username: req.session.username,
                nomListe: nomNouvelleListe,
                done: false
            };

            dataLayerListe.insertTask(dataToInsert, req.session.username, nomNouvelleListe, function (listeUser) {

                res.json(listeUser);
            });
        }
        else if (userConnected !== null) {
            console.log("Je suis dans ListeCreate");

            var dataToInsert = {
                text: req.body.text,
                date: Date.now(),
                username: userConnected,
                nomListe: nomNouvelleListe,
                done: false
            };

            dataLayerListe.insertTask(dataToInsert, userConnected, nomNouvelleListe, function (listeUser) {

                res.json(listeUser);
            });
        }
        else {

            res.sendStatus(403);
        }
    }

    else {

        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });
    }
});

// Modifie une tache
routerListe.post('/Liste/modify/:liste_id/:text', function (req, res) {
    if (req.params) {
        if (req.session.username !== undefined) {
            dataLayerListe.modifyTask(req.params.liste_id, req.params.text, req.session.username, nomNouvelleListe, function (docs) {
                res.json(docs);
            });
        }
        else if(userConnected !== undefined)
        {
            console.log("Test");
            dataLayerListe.modifyTask(req.params.liste_id, req.params.text, userConnected, nomNouvelleListe, function (docs) {
                res.json(docs);
            });
        }
        else {
            res.sendStatus(403);
        }

    }
    else {
        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });
    }
});

routerListe.get("/getMyNomDeListe/:nomdeliste", function (req, res) {
    //console.log("Je get mon nomNouvelleListe a " + req.params.nomdeliste);
    nomNouvelleListe = req.params.nomdeliste;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
});

// Afficher la liste d'un utilisateur
routerListe.get("/ListeUser", function (req, res) {
    // console.log("Je suis dans listeUser")

    if (req.session.username !== undefined) {
        if (nomNouvelleListe !== null) {
            dataLayerListe.getTaskFromCollection(req.session.username, nomNouvelleListe, function (maliste) {
                console.log("Le contenu de ma liste : ")
                console.log(maliste);

                res.json(maliste);
            });
        }
    }
    else {
        if (userConnected != null) {
            // console.log("Dans la partie mobile")
            dataLayerListe.getTaskFromCollection(userConnected, nomNouvelleListe, function (maliste) {
                console.log("Le contenu de ma liste : ");
                console.log(maliste);

                res.json(maliste);
            });
        }
        else {
            res.sendStatus(403);
        }
    }
});

// Rend la page de creation de compte
routerListe.get("/CreateAcc", function (req, res) {
    res.sendFile(__dirname + '/Signup.html');
});


// Rend la page de l'affichage de Liste
routerListe.get("/AfficheListe", function (req, res) {
    //console.log("Je suis dans AfficheListe")

    // if(req.Session.username!=null) else rediriger
    if (req.session.username !== undefined)
        res.sendFile(__dirname + '/Liste.html');
    else
        res.sendStatus(403);
});

//Deconnexion
routerListe.post("/Deconnexion", function (req, res) {
    if(req.session.username !== undefined)
    {
        req.session.destroy();
        res.send(req.session);
        res.redirect("/");
    }
    else{
        if(userConnected !== undefined)
        {
            userConnected=undefined;
            res.sendStatus(200);
        }
        else {
            res.sendStatus(403);
        }
    }


});

routerListe.post('/Signup/:username/:password', function (req, res) {
    console.log(req.params.username);
    console.log(req.params.password);

    if(req.params.username !== null && req.params.password !== null)
    {

        console.log("OK on va insérer")
        var dataToInsert = {
            username: req.params.username,
            password: req.params.password
        };
        dataLayerListe.insertUser(dataToInsert, function(docs){
            console.log("OK DATA INSERTED");
            res.sendStatus(docs);
        });
    }
});


// Met une tâche a "fait"
routerListe.post('/Liste/:liste_id/:done', function (req, res) {

    if (req.params) {
        if (req.session.username !== undefined) {
            dataLayerListe.checkTask(req.params.liste_id, req.params.done, req.session.username, nomNouvelleListe, function (docs) {
                res.json(docs);
            });
        }
        else
        {
            if (userConnected !== undefined) {
                dataLayerListe.checkTask(req.params.liste_id, req.params.done, userConnected, nomNouvelleListe, function (docs) {
                   console.log(docs);
                    res.json(docs);
                });
            }
            else
                res.send({
                    success: false,
                    errorCode: "PARAM_MISSING"
                });
        }
    }
    else {
        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });
    }
});

//Supprime une liste complete
routerListe.post('/deleteListe/:nom', function (req, res) {
    console.log(req.params.nom);
    if (req.params) {
        dataLayerListe.deleteListe(req.params.nom, userConnected, function (callback) {
            // console.log(callback);

            //  res.setHeader('Access-Control-Allow-Credentials', true);
            // res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.sendStatus(200);
        });
    }
    else {
        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });
    }
});

//Supprime la tâche à faire
routerListe.post('/List/delete/:liste_id', function (req, res) {
    console.log(nomNouvelleListe);
    if (req.params) {
        if (req.session.username !== undefined) {
            dataLayerListe.deleteTask(req.params.liste_id, req.session.username, nomNouvelleListe, function (docs) {
                res.send(docs);
            });
        }
        else {
            if (userConnected !== undefined) {
                dataLayerListe.deleteTask(req.params.liste_id, userConnected, nomNouvelleListe, function (docs) {
                    res.send(docs);
                });
            }
        }
    } else {
        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });
    }
});

module.exports = routerListe;

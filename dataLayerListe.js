var MongoClient = require("mongodb").MongoClient;
var uri = "mongodb+srv://Xenon:batman2010@cluster0-arabs.mongodb.net/AppListe?retryWrites=true";
var ObjectId = require('mongodb').ObjectID;

// var mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://Xenon:batman2010@cluster0-arabs.mongodb.net/AppListe?retryWrites=true', { useNewUrlParser: true });

var client = new MongoClient(uri, {
    useNewUrlParser: true
});

var db;

var dataLayerListe = {
    // OK !
    init : function(cb) { // on passe une fonction -> callback
        client.connect(function(err) {
            if(err) throw err;
            console.log("Connected to DB");
            db = client.db("AppListe");
            cb();
        });
    },
    // OK !
    checkUser: function(session,username,password,cb){
        db.collection("user").count({"username": username, "password" : password },function(err, result) {
            if (err) throw err;
            //console.log(result);
            if(result!== 0)
            {
               //you Connected
               console.log("User "+username+" successfuly connected");
               //req.session._id=uuidv1();
               session.username=username;
               console.log(session);
               //Si je me suis co je lui envoie liste.html
               //console.log("tentative de sendfile")
                cb(200)
            }
            else{
                cb(403);
            }
          });
    },
    //A tester
    getTaskFromCollection : function(username, listName, cb) {
        console.log(listName);
        db.collection("listes").find({"username": username, "nomListe" : listName}).toArray(function(err, docs) { //Docs est le résultat de find
            cb(docs);
        });
        /*
        db.collection("listes").find({"username": username, "nomListe" : listName}).toArray(function(err, docs) { //Docs est le résultat de find
            cb(docs);
        });*/
    },

    //OK ! 
    getTask : function(username, cb) {
        db.collection("listes").find({"username": username}).toArray(function(err, docs) { //Docs est le résultat de find
            cb(docs);
        });
    },

    insertUser : function(task, cb){

        db.collection("user").find({"username": task.username, "password" : task.password}).toArray(function(err, docs) { //Docs est le résultat de find
            if(docs.length == 0)
            {
                db.collection("user").insertOne(task, function(err, result) {
                    console.log(result);
                    cb(200);
                });
            }
            else {
                cb(403);
            }
        });
        

    
    },
    //OK !
    insertTask : function(task, user, listName, cb) {
        console.log("J'ai insert la task");
        console.log(listName);
        db.collection("listes").insertOne(task, function(err, result) {
            console.log(result);
            db.collection("listes").find({"username": user, "nomListe" : listName}).toArray(function(err, docs) { //Docs est le résultat de find
                console.log(docs);
                cb(docs);
            });
         });
    },
    //OK !
    afficheListeName : function(username, cb){
        db.collection("listes").distinct("nomListe", {"username" : username} ,function(err,docs){
            console.log("Affichage de liste name");
            console.log(docs);
            cb(docs);
        });
    },
    //to TEST 
    
    deleteListe : function(nomListe, username, callback){
        console.log(nomListe);
        var query= { "nomListe" : nomListe,
                    "username" : username }
      //  console.log(nomListe + " " + username);
        db.collection("listes").deleteMany( query, function(err,deletedCount){
            console.log("Apres delete de doc, mon remove renvoit : ");
       
            console.log(deletedCount); 
            callback(200);
        });
    },

    //OK ! 
    checkTask : function(task, data, username, nomListe, cb) {
        var query= { "_id" : ObjectId(task)}
       // console.log("Je check ma task"+task);
        var dataBoolean;
        if(data==="false") // Car data est passé en chaine de caractères
            dataBoolean=false;
        else
            dataBoolean=true;
        var newData = { $set: { "done" : dataBoolean } };

        db.collection("listes").updateOne(query, newData, function(err, result) {
            db.collection("listes").find({"username": username, "nomListe" : nomListe }).toArray(function(err, docs) { //Docs est le résultat de find
                cb(docs);
            });
        });
    },

    //OK ! 
    modifyTask : function(task, data, username, nomListe, cb) {
        var query= { "_id" : ObjectId(task)}
        var newData = { $set: { "text" : data } };

        db.collection("listes").updateOne(query, newData, function(err, result) {
            db.collection("listes").find({"username": username, "nomListe" : nomListe}).toArray(function(err, docs) { //Docs est le résultat de find
                cb(docs);
            });
        });
    },
    //OK !
    deleteTask : function(task, username, nomListe, cb) {
        var _id = {
            '_id' : ObjectId(task)
        }
        console.log(_id);
        db.collection("listes").deleteOne(_id , function(err, result) {
            if(err) throw err;
            db.collection("listes").find({"username": username, "nomListe" : nomListe}).toArray(function(err, docs) { //Docs est le résultat de find
                if(err) throw err;
                cb(docs);
            });
        });
    }
}

module.exports = dataLayerListe;
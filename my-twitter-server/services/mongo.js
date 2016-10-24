var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/twitter_dev";

var optionvalues = {
  db:{
    numberOfRetries : 5
  },
  server: {
    auto_reconnect: true,
    poolSize : 40,
    socketOptions: {
        connectTimeoutMS: 5000
    }
  },
  replSet: {},
  mongos: {}
};

function poolMongo(){}

var dbconnect;

function initiatePooling(callback){
  MongoClient.connect(url, optionvalues, function(err, db) {
    if (err) throw err;

    dbconnect = db;
    connected = true;
    if(callback && typeof(callback) == 'function')
        callback(dbconnect);
  });
  return poolMongo;
}

poolMongo.initiatePooling = initiatePooling;

function connect(url, callback){
  if(!dbconnect){
    initiatePooling(callback)
  }
  else{
    if(callback && typeof(callback) == 'function')
      callback(dbconnect);
  }
}


poolMongo.connect = connect;


module.exports = poolMongo;

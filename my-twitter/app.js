/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var session = require('client-sessions'); 
var home = require('./routes/home1');
//-------------------------
//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter_dev";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
//-----------------------------------------
var app = express();

/*app.use(session({

    cookieName: 'session',
    secret: 'kulja_sim_sim',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,  })
    );*/

//mongo session
app.use(expressSession({
	secret: 'kulja_sim_sim',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
//------------------------

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/profile',home.redirectoprofile);
app.get('/gotofollower',function(req,res){
	res.send({"statusCode":200});
});

app.post('/hashtag',function(req,res){
	console.log('this is hash function');
});

app.get('/following',home.redirecttofollower); //page redirect
app.get('/followers',home.my_followers); // page redirect
app.get('/editprofile',home.editprofile); // page redirect
app.get('/tweets',home.redirecttotweets); //page redirect
app.get('/hashtags',home.redirecttotags); //page redirect
// POST-------------
app.post('/signup',home.addnewuser); //mongo'ed & MQ'ed--
app.post('/validate',home.validate); //mongo'ed & MQ'ed--
app.post('/logout',home.logout); // mongo'ed and mq'ed
app.post('/tweet',home.tweetmessage);//mongo'ed & MQ'ed--
app.post('/follow',home.tofollow);//mongo'ed & MQ'ed
app.post('/willretweet',home.retweetinsert); //mongo'ed & MQ'ed --
app.post('/updateprofile',home.updateprofileinfo);//mongo'ed & MQ'ed
app.post('/hash',home.gethashtags); //mongo'ed and mq'ed
//---------api-----
app.get('/api/getdata',home.getdata); //mongo'ed and MQ'ed
app.get('/api/mytweets',home.mytweetmsg); //mongo'ed & MQ'ed--
app.get('/api/gettweetcount',home.gettweetcount); //mongo'ed & MQ'ed
app.get('/api/allotherusers',home.allotherusers); // mongo'ed & MQ'ed
app.get('/api/isfollowing',home.followingusers); //mongo'ed & MQ'ed
app.get('/api/followers',home.myfollowers); //mongo'ed & MQ'ed
app.get('/api/followertweets',home.followertweets); //mongo'ed & MQ'ed
app.get('/api/myfollowerslist',home.myfollowerslist); // mongo'ed & MQ'ed
app.get('/api/myfollowingusers',home.myfollowinglist); //mongo'ed & MQ'ed
app.get('/api/getupdatedetails',home.getupdatedetails); //mongo'ed & MQ'ed
//app.get('/api/gethashval',home.gethashtags);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * New node file
 */
var ejs = require("ejs");
var mq_client = require('../rpc/client');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter_dev";
var bcryptnjs = require('bcrypt-nodejs');

// testing with mq-----------------------------------------------------
exports.validate = function(req,res){
	var userid = req.param("email");
	var password = req.param("password");
	var msg_payload = {"userid":userid,"password":password};
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login d");
				req.session.email=userid;				
				res.send({"statusCode":200});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"statusCode":401});
			}
		}  
	});

};

//MQ'ed
exports.getProfiledata = function(req,res){

   var getuser = "SELECT * FROM users_info " +
      "WHERE useremail='" + req.session.email +"'";
      //Set these headers to notify the browser not to maintain any cache for the page being loaded
      console.log(getuser);
      mydb.executeQuery(function(err,result){

          if(err){
              throw err;
          }
          else
          {
              if(result.length>0)
              {   console.log("hi from profile data");
                 // console.log(result);
                  
              }
              else{
                  console.log('try again');
                  
                  // res.render('index',{title: 'Login',message:"username or password is not valid"});
                  
              }

          }
      },getuser);

    /*  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render("homepage",{username:req.session.username});*/


};

//MQ'ed
exports.getdata = function(req,res){
	
	var email = req.session.email;
	console.log("getdata"+email);
	var msg_payload = {"email":email,"type":"profiledata"};
	
	mq_client.make_request('profile_queue',msg_payload, function(err,result){
		
		if(err){
			throw err;
		}
		else 
		{
			if(result.statusCode == 200)
			{
				console.log("profile data mq");	
				console.log(result);
				res.send(result);
			}
			else 
			{    				
				console.log("no profile data");
				res.send({"statusCode":401});
			}
		}  
	});	
};

//MQ'ed
exports.redirectoprofile=function(req,res) {

      if(req.session.email)
      {
          res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          res.render('profile');
      }
      else
      {
          res.redirect('/');
      }
  };
    

exports.editprofile=function(req,res) {

      if(req.session.email)
      {
          res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          res.render('editprofile');
      }
      else
      {
          res.redirect('/');
      }
};

// testing with mongo
exports.addnewuser = function(req,res){
	
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var password = req.param("password")
	var msg_payload = {
		              "firstname":firstname,
		              "lastname":password,
		              "password":password,
		              "twitterhandle":"",
		              "dob":"",
		              "contact":"",
		              "location":"",
		              "isfollowing":[],
		              "isfollowedby":[]
					  };
	
mq_client.make_request('addnewuser_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login d");
								
				res.send({"statusCode":200});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"statusCode":401});
			}
		}  
	});
};

exports.logout = function(req,res) {
  req.session.destroy();
  res.send({statuscode:200});
};


//Mq'ed
exports.tweetmessage=function(req,res){
	console.log("from tweet api");
	
	var msg_payload = {"email":req.session.email,"tweetmsg":req.param("tweetmsg"),"type":"tweeted"};
	
	mq_client.make_request('tweet_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{
			res.send(result);
		}  
	});
};

//MQ'ed
exports.retweetinsert=function(req,res){
	console.log("from retweet api");
	
	var msg_payload = {"email":req.session.email,"tweettext":req.param("tweettext"),"type":"retweet","tweetof":req.param("tweetof")};

	mq_client.make_request('tweet_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{
			res.send(result);
		}  
	});
	
};


exports.updateprofileinfo=function(req,res){
	
	var msg_payload = {
			"dob":req.param("birthday"),
			"contact":req.param("contact"),
			"location":req.param("location"),
			"twitterhandle":req.param("twitterhandle")
			,"useremail":req.session.email
			};

	mq_client.make_request('updateprofileinfo_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{
			res.send(result);
		}  
	});
	
};


exports.getupdatedetails=function(req,res){
	
	var msg_payload = {
			"useremail":req.session.email
			};

	mq_client.make_request('getupdatedetails_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{
			res.send(result);
		}  
	});
	
};

//MQ'ed
exports.mytweetmsg=function(req,res){
	console.log("from mytweet msgs api");
	
	var msg_payload = {"email":req.session.email,"type":"mytweets"};

	mq_client.make_request('mytweetlist_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});
	
};


exports.gethashtags=function(req,res){
	var val = '#first';
	 var gettags = "SELECT useremail,tweet_message FROM tweet WHERE tweet_message LIKE '" + val +"%'";
  //Set these headers to notify the browser not to maintain any cache for the page being loaded
  console.log(gettags);
  mydb.executeQuery(function(err,result){

      if(err){
          throw err;
      }
      else
      {
          if(result.length>0)
          {   console.log("hi from my tweet query");
          		console.log(JSON.stringify(result));
					json_responses = {"statusCode" : 200,
							"result": result};
					res.send(json_responses);

          }
          else{
              console.log('no tweets');
              
              // res.render('index',{title: 'Login',message:"username or password is not valid"});
              
          }

      }
  },gettags);

};


//mq'ed
exports.followertweets=function(req,res){
	 console.log("followertweet api");
	 
		var msg_payload = {"email":req.session.email,"type":"followertweets"};

		mq_client.make_request('followertweets_queue',msg_payload, function(err,result){
			if(err){
				throw err;
			}
			else 
			{	console.log(result);
				res.send(result);
			}  
		});
		
};



//mq'ed
exports.gettweetcount = function(req,res){
	
	var msg_payload = {"email":req.session.email,"type":"gettweetcount"};

	mq_client.make_request('gettweetcount_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});
};


//mq'ed
exports.allotherusers = function(req,res){
	var msg_payload = {"email":req.session.email,"type":"allotherusers"};

	mq_client.make_request('allotherusers_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});
};


//mq'ed
exports.tofollow = function(req,res){
	
	var msg_payload = {"email":req.session.email,"isfollowing":req.param("isfollowing"),"type":"tofollow"};

	mq_client.make_request('tofollow_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	}); 
};


//mq'ed
exports.followingusers = function(req,res){
	
	var msg_payload = {"email":req.session.email,"type":"tofollow"};

	mq_client.make_request('followingusers_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	}); 		
	
};


//to get the count of my followers mongo
exports.myfollowers = function(req,res){
	
	var msg_payload = {"email":req.session.email,"type":"myfollowers"};

	mq_client.make_request('myfollowers_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});
};

//to get myfollowerlist
exports.myfollowerslist = function(req,res){
	
	var msg_payload = {"email":req.session.email,"type":"myfollowerslist"};

	mq_client.make_request('myfollowerslist_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});
 };


//testing with mongo
exports.myfollowinglist = function(req,res){
	console.log('troy');
	var msg_payload = {"email":req.session.email,"type":"myfollowinglist"};

	mq_client.make_request('myfollowinglist_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});
	  
};



exports.redirecttofollower = function(req,res){
  if(req.session.email)
  {
      //Set these headers to notify the browser not to maintain any cache for the page being loaded
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
     // res.render("test",{username:req.session.email});
     // res.sendfile('views/alpha.ejs');
      res.render('following');
  }
  else
  {
      res.redirect('/');
  }
};

exports.redirecttotags = function(req,res){
  if(req.session.email)
  {
      //Set these headers to notify the browser not to maintain any cache for the page being loaded
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
     // res.render("test",{username:req.session.email});
     // res.sendfile('views/alpha.ejs');
      res.render('hashtag');
  }
  else
  {
      res.redirect('/');
  }
};

exports.gethashtags = function(req,res){	
	var msg_payload = {"email":req.session.email,"key":req.param("key")};

	mq_client.make_request('gethashtags_queue',msg_payload, function(err,result){
		if(err){
			throw err;
		}
		else 
		{	console.log(result);
			res.send(result);
		}  
	});	  	
};

exports.redirecttotweets = function(req,res){
  if(req.session.email)
  {
      //Set these headers to notify the browser not to maintain any cache for the page being loaded
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
     // res.render("test",{username:req.session.email});
     // res.sendfile('views/alpha.ejs');
      res.render('tweets');
  }
  else
  {
      res.redirect('/');
  }
};

exports.my_followers = function(req,res){
  if(req.session.email)
  {
      //Set these headers to notify the browser not to maintain any cache for the page being loaded
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
     // res.render("test",{username:req.session.email});
     // res.sendfile('views/alpha.ejs');
      res.render('followers');
  }
  else
  {
      res.redirect('/');
  }
};


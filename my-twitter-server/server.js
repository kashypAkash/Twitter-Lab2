
//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter_dev";
//var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./services/mongo");
var cnn = amqp.createConnection({host:'127.0.0.1'});

mongo.initiatePooling();

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('addnewuser_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.addnewusers(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('updateprofileinfo_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.updateprofileinfo(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('gethashtags_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.gethashtags(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('getupdatedetails_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.getupdatedetails(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('profile_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_profile(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('tweet_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.type=="tweeted"){
			  login.tweetmessage(message, function(err,res){

				//return index sent

				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			  });
			}

			else if(message.type=="retweet")
			{
				login.retweetinsert(message, function(err,res){

					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}

		});
	});

	cnn.queue('mytweetlist_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.mytweetmsg(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });


	cnn.queue('followertweets_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.followertweets(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });


	cnn.queue('gettweetcount_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.gettweetcount(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });


	cnn.queue('allotherusers_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.allotherusers(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });

	cnn.queue('tofollow_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.tofollow(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });


	cnn.queue('followingusers_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.followingusers(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });

	cnn.queue('myfollowers_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.myfollowers(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });

	cnn.queue('myfollowerslist_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.myfollowerslist(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });

	cnn.queue('myfollowinglist_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.myfollowinglist(message, function(err,res){

			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	 });
  });

});

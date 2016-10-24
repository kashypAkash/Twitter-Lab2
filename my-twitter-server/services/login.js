var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter_dev";
var bcryptnjs = require('bcrypt-nodejs');

exports.handle_request = function(msg, callback){

	var res = {};
	console.log("In handle request:"+ msg.userid);
	mongo.connect(mongoURL, function(mdb){
		console.log('Hi: ' + mongoURL);
		var coll = mdb.collection('users_info');

		coll.findOne({useremail: msg.userid}, function(err, user){
			console.log("inside");
	        if(err){
	            throw err;
	        }
	        else
	        {
	        	if (user) {
	        		bcryptnjs.compare(msg.password, user.password, function(err,isPassword) {
	            	  	  if(isPassword){
	                  		res.code = "200";
	                		res.value = "Succes Login";
	                		console.log("is pass");
	                         callback(null, res);
	                         //mongo.release(mdb);

	            	  	  }
	            	  	  else{

	            	  		res.code = "401";
	            			res.value = "Failed Login";
	            			console.log("is not password");
	            			// mongo.release(mdb);
	            	  	  }

	            	  });

	        	}
	        	else {
	        		console.log("returned false" + " " + user + " " + JSON.stringify(user).length);
	        		json_responses = {"statusCode" : 401};
	        		res.code = "401";
	        		res.value="Not a user";
	        		callback(null, res);
	        		 //mongo.release(mdb);
	        		}
	        }
		});
	});
	console.log("handle req" + JSON.stringify(res));
	//callback(null, res);
};

exports.handle_profile = function(msg, callback){

	var res = {};
	console.log("In handle profile:"+ msg.email);
	 mongo.connect(mongoURL, function(mdb){
			var coll = mdb.collection('users_info');

				 coll.findOne(
						  		{
						  			"useremail":msg.email
				  				},
						  		{
				  					"useremail":1,
				  					"firstname":1,
				  					"lastname":1,
				  					"_id":0,

						  		}, function(err, result){
					  			 	if(err){
					  			 		//res.send({error:true});
				            	  		res.statusCode = "401";
				            			res.value = "Error fetching data";
					  			 	}
					  			 	else
					  			 	{
					  		            if(result)
					  		            {   console.log("hi from my getdata query");
					  		            		console.log(JSON.stringify(result));
					  							json_responses = {"statusCode" : 200,
					  									"result": result};
					  							res.statusCode = "200";
					  							res.result = result;

					  							callback(null, res);
					  							//res.send(json_responses);
					  		            }
					  		            else
					  		            {
					  		                console.log('tweet count is zero');

					  		                callback(null, res);
					  		            }
					  			 	}
		            });
		       });


};

exports.tweetmessage=function(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function(mdb){
		var coll = mdb.collection('tweet');
			  coll.update({"useremail": msg.email},
					{
				  		$push:{
				  				"tweet":{
				  						"message":msg.tweetmsg,
				  						"isretweet":false,
				  						"tweetof":"",
				  						"attime":Date()
				  						}
				  			  }
					},{upsert:true}, function(err, result){
				        if(err){
				            //throw err;
				        	console.log("error aaja");
				        	res.statusCode=401;
				        	callback(null,res);
				        }
				        else
				        {
				            console.log('succesfully tweeted');
							res.statusCode=200;
							callback(null,res);
				        }
	            });
	       });

};

exports.retweetinsert=function(msg,callback){
	var res = {};
	  mongo.connect(mongoURL, function(mdb){
			var coll = mdb.collection('tweet');

				  coll.update({"useremail": msg.email},
						{
					  		$push:{
					  				"tweet":{
					  						"message":msg.tweettext,
					  						"isretweet":true,
					  						"tweetof":msg.tweetof,
					  						"attime":Date()
					  						}
					  			  }
						}, function(err, result){
					        if(err){
					            //throw err;
					        	res.statusCode=401;
					        	callback(null,res);
					        }
					        else
					        {
					            console.log('succesfully retweeted');
								res.statusCode=200;
								callback(null,res);
					        }
		            });
		       });
};



exports.mytweetmsg=function(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function(mdb){
		mdb.collection("tweet").find({
										"useremail":msg.email
									  },
									  {
										  "useremail":1,
										  "tweet":1,
										  "_id":0
									  }).toArray(function(err,result){
										  if(err){
											  throw err;
										  }
										  else{
											  if(result){
												  console.log("my tweetmsg " + result);
												  res.statusCode=200;
												  res.result=result;
												  callback(null,res);
											  }
											  else{
												  console.log("error in result");
												  res.statusCode=401;
												  callback(null,res);
											  }
										  }
									  });

	});

};

exports.addnewusers = function(msg,callback){
	var res={};
	var passkey = msg.password;
	bcryptnjs.hash(passkey, null, null, function(err, hash) {
		console.log("hash" + "  " + hash);

		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mdb.collection('users_info');

			  coll.insert({
				  	"firstname": msg.firstname,
					"lastname":msg.lastname,
					"useremail":msg.useremail,
					"password":hash,
					"twitterhandle":msg.twitterhandle,
					"dob":msg.dob,
					"contact":msg.contact,
					"location":msg.location,
					"isfollowing":msg.isfollowing,
					"isfollowedby":msg.isfollowedby
					}, function(err, result){
				        if(err){
				            //throw err;
				        	console.log("error aaja");
				        	  res.statusCode=401;
							  callback(null,res);
				        }
				        else
				        {
				            console.log('succesfully inserterd');
							  res.statusCode=200;

							  callback(null,res);
				            //
				        }

	            });


	       });

	});

};

exports.updateprofileinfo= function(msg,callback){
	var res = {};
  mongo.connect(mongoURL, function(mdb){
	mdb.collection('users_info').update({"useremail":msg.useremail},{"dob":msg.birthday,"contact":msg.contact,"location":msg.location,"twitterhandle":msg.twitterhandle}).toArray(function(err,result){
			if(err){
			console.log("error from inner query");
			  res.statusCode=401;
			  callback(null,res);
		}
		else {
						if(result)
						{  		console.log("hi from my updateprofile query");
								console.log(result);
								  res.statusCode=200;
								  res.result=result;
								  callback(null,res);
							  }
							  else{
								  console.log("error in result");
								  res.statusCode=401;
								  callback(null,res);
							  }
		}
	});
  });
};

exports.gethashtags = function(msg,callback){
	var res = {};

	  mongo.connect(mongoURL, function(mdb){
			mdb.collection('tweets').find({"useremail":msg.useremail},{"message":{$regex:msg.key}}).toArray(function(err,result){
					if(err){
					console.log("error from inner query");
					  res.statusCode=401;
					  callback(null,res);
				}
				else {
								if(result)
								{  		console.log("hi from gethashtags query");
										console.log(result);
										  res.statusCode=200;
										  res.result=result;
										  callback(null,res);
									  }
									  else{
										  console.log("error in result");
										  res.statusCode=401;
										  callback(null,res);
									  }
				}
			});
		  });

};

exports.getupdatedetails = function(msg,callback){
	var res = {};

	  mongo.connect(mongoURL, function(mdb){
		mdb.collection('users_info').find({"useremail":msg.useremail},{"dob":msg.birthday,"contact":msg.contact,"location":msg.location,"twitterhandle":msg.twitterhandle}).toArray(function(err,result){
				if(err){
				console.log("error from inner query");
				  res.statusCode=401;
				  callback(null,res);
			}
			else {
							if(result)
							{  		console.log("hi from getupdatedetails query");
									console.log(result);
									  res.statusCode=200;
									  res.result=result;
									  callback(null,res);
								  }
								  else{
									  console.log("error in result");
									  res.statusCode=401;
									  callback(null,res);
								  }
			}
		});
	  });
};


exports.followertweets=function(msg,callback){
	var res = {};
	 mongo.connect(mongoURL, function(mdb){
					mdb.collection('users_info').find({"useremail":msg.email},{"isfollowing":1,"_id":0}).toArray(function(err,list){
								if(err){
									console.log("error in the followertweet query");
								}
								else{
									mdb.collection('tweet').find({"useremail":{$in:list[0].isfollowing}},{"useremail":1,"tweet":1,"_id":0}).toArray(function(err,result){
										 			if(err){
														console.log("error from inner query");
														res.send({error:true});
													}
													else {
																	if(result)
																	{  		console.log("hi from my follower tweet query");
																			console.log(result);
																			  res.statusCode=200;
																			  res.result=result;
																			  callback(null,res);
																		  }
																		  else{
																			  console.log("error in result");
																			  res.statusCode=401;
																			  callback(null,res);
																		  }
													}
									 });
								}
					});

		});
};

exports.gettweetcount=function(msg,callback){
	var res = {};
	 mongo.connect(mongoURL, function(mdb){
			var coll = mdb.collection('tweet');
				  coll.aggregate([
				                  {
				                	$project:{
				                				"useremail":1,
				                				"_id":0,
				                				"tweetcount":{$size:"$tweet"}
				                			 }
				                  },
				                  {
				                	$match:{"useremail":msg.email}
				                  }
				                  ], function(err, result){
					  			 	if(err){
					            //throw err;
					  			 		console.log("error aaja");
					  			 		res.send({error:true});
					  			 	}
					  			 	else
					  			 	{
					  		            if(result)
					  		            {   console.log("hi from my tweet count query");
										  res.statusCode=200;
										  res.result=result;
										  callback(null,res);
					  		            }
					  		            else
					  		            {
										  console.log("error in result");
										  res.statusCode=401;
										  callback(null,res);
					  		            }
					            //
					  			 	}
		            });
		       });
};

exports.allotherusers=function(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function(mdb){
				mdb.collection('users_info').find({"useremail":msg.email},{"isfollowing":1,"_id":0}).toArray(function(err,list){
							if(err){
								console.log("error in the query");
							}
							else{
								mdb.collection('users_info').find({$and:[{"useremail":{$ne:msg.email}},{"useremail":{$nin:list[0].isfollowing}}]},{"useremail":1,"_id":0}).toArray(function(err,result){
									 			if(err){
													console.log("error from inner query");
													res.send({error:true});
												}
												else {
																if(result)
																{   console.log("hi from my allother query");
																  res.statusCode=200;
																  res.result=result;
																  console.log(result);
																  callback(null,res);
											  		            }
											  		            else
											  		            {
																  console.log("error in result");
																  res.statusCode=401;
																  callback(null,res);
											  		            }

												}
								 });
							}
				});

	});
};

exports.tofollow=function(msg,callback){
	var res = {};
	  mongo.connect(mongoURL, function(mdb){
			var coll = mdb.collection('users_info');

				  coll.update({"useremail": msg.email},
						{
					  		$push:{
					  				"isfollowing": msg.isfollowing
					  			  }
						}, function(err, result){
					        if(err){

					        	console.log("error aaja");
					        	res.error="error";
					        }
					        else
					        {
								  res.statusCode=200;
								  res.result=result;
								  callback(null,res);
					            //
					        }
		            });
		       });
};

exports.followingusers=function(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function(mdb){
				var coll = mdb.collection('users_info');

					  coll.aggregate([
					                  {
					                	$project:{
					                				"useremail":1,
					                				"_id":0,
					                				"followcount":{$size:"$isfollowing"}
					                			 }
					                  },
					                  {
					                	$match:{"useremail":msg.email}
					                  }
					                  ], function(err, result){
						  			 	if(err){
						            //throw err;
						  			 		console.log("error aaja");
						  			 		res.error="error";
						  			 	}
						  			 	else
						  			 	{
						  		            if(result)
						  		            {   console.log("hi from my followinguser count query");
											  res.statusCode=200;
											  res.result=result;
											  callback(null,res);
						  		            }
						  		            else
						  		            {
											  console.log("error in result");
											  res.statusCode=401;
											  callback(null,res);
						  		            }
						            //
						  			 	}

			            });


			       });

};

exports.myfollowers=function(msg,callback){
	var res = {};

	mongo.connect(mongoURL, function(mdb){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mdb.collection('users_info');

			  coll.aggregate([
			                  {
			                	$project:{
			                				"useremail":1,
			                				"_id":0,
			                				"followerscount":{$size:"$isfollowedby"}
			                			 }
			                  },
			                  {
			                	$match:{"useremail":msg.email}
			                  }
			                  ], function(err, result){
				  			 	if(err){
				            //throw err;
				  			 		console.log("error aaja");
				  			 		//res.send({error:true});
				  			 	}
				  			 	else
				  			 	{
				  		            if(result)
				  		            {   console.log("hi from my followed query");
									  res.statusCode=200;
									  res.result=result;
									  callback(null,res);
				  		            }
				  		            else
				  		            {
									  console.log("error in result");
									  res.statusCode=401;
									  callback(null,res);
				  		            }

				  			 	}

	            });
	       });


};

exports.myfollowerslist=function(msg,callback){
	var res = {};

	console.log("myfollowerslist");
	 mongo.connect(mongoURL, function(mdb){

			mdb.collection("users_info").find({
											"isfollowing":msg.email
										  },
										  {
											  "useremail":1,
											  "firstname":1,
											  "lastname":1,
											  "_id":0
										  }).toArray(function(err,result){
											  if(err){
												  throw err;
											  }
											  else{
												  if(result){
													  res.statusCode=200;
													  res.result=result;
													  callback(null,res);
								  		            }
								  		            else
								  		            {
													  console.log("error in result");
													  res.statusCode=401;
													  callback(null,res);
								  		            }
											  }
										  });
		});


};

exports.myfollowinglist=function(msg,callback){
	var res = {};

	mongo.connect(mongoURL, function(mdb){
					mdb.collection('users_info').find({"useremail":msg.email},{"isfollowing":1,"_id":0}).toArray(function(err,list){
								if(err){
									console.log("error in the query");
								}
								else{
									mdb.collection('users_info').find({"useremail":{$in:list[0].isfollowing}},{"useremail":1,"firstname":1,"lastname":1,"_id":0}).toArray(function(err,result){
										 			if(err){
														console.log("error from inner query");
														res.send({error:true});
													}
													else {
																	if(result)
																	{   console.log("hi from my following query");
																	  res.statusCode=200;
																	  res.result=result;
																	  callback(null,res);
												  		            }
												  		            else
												  		            {
																	  console.log("error in result");
																	  res.statusCode=401;
																	  callback(null,res);
												  		            }

													}
									 });
								}
					});
	});
};

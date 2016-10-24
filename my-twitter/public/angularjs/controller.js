"use strict";
angular.module('myApp', [])

    .controller('formCtrl', ['$scope', '$http', function($scope, $http) {
    	
    	$scope.addUser = function(){
            $http({
                method: "POST",
                url : '/signup',
                data : {
                    "firstname":$scope.firstname,
                    "lastname":$scope.lastname,
                    "useremail":$scope.useremail,
                    "password":$scope.password

                }
            }).success(function(data){
                if(data.statusCode===401){
                    console.log('unauthorized request, status:401');
                    $scope.signmsg="I!";
                }
                else
                {	if(data.error){
                		$scope.signmsg="User already Exists";
                	}else{
                		$scope.signmsg="Sign Up Successful!";
                		window.location.assign('/');
                	}
                    
                }
            }).error(function(error){
                console.log('already exist');
            })
        };
    }])
    
    .controller('controllerLogin', ['$scope', '$http',function($scope,$http){
    	  
    	$scope.userLogin = function(){
        $http({
           method:"POST",
           url : "/validate",
           data : {
                    email:$scope.email,
                    password:$scope.password
                  }
       }).success(function(data){
           if(data.statusCode===401){
        	   $scope.invalidlogin="Invalid Credentials"
               console.log('unauthorised request jkfa');
           }
           else
           {	
               window.location.assign("/profile");
           }
       }).error(function(error){
           console.log(error);
       })
       };
   }])
    
    .controller('profilectrl', ['$scope', '$http',function($scope,$http){
    	
    	  $http.get('/api/getdata').success(function(data) {
              $scope.firstname = data.result.firstname;
              $scope.lastname = data.result.lastname;
              $scope.useremail= data.result.useremail;
              //$scope.dob = data.result[0].dob;
              //$scope.location = data.result[0].location;
              //$scope.contact = data.result[0].contact;
              console.log(data);
          }).error(function(err){
            console.log(err);
          });
    	  
    	  $scope.editprofile = function(){
              $http({
                  method: "POST",
                  url : '/updateprofile',
                  data : {
                      "twitterhandle":$scope.twitter_handle,
                      "birthday":$scope.birthday,
                      "contact":$scope.contact,
                      "location":$scope.location

                  }
              }).success(function(data){
                  if(data.status==401){
                      console.log('unauthorized request, status:401');

                  }
                  else
                  {
                     // window.location.assign('/');
                  }
              }).error(function(error){
                  console.log('error');
              })
          };

    	  
    	  $scope.logout = function(){
    	       $http({
    	           method:"POST",
    	           url : "/logout",
    	           
    	       }).success(function(data){
    	           if(data.statusCode==401){
    	               console.log('unauthorised request jkfa');
    	           }
    	           else
    	           {
    	               window.location.assign("/");
    	           }
    	       }).error(function(error){
    	           console.log(error);
    	       })
    	       };
    	       
 //to tweet a message   	       
    	       $scope.tweetmessage = function(){
    	    	   console.log("hi");
    	            $http({
    	                method: "POST",
    	                url : '/tweet',
    	                data : {
    	                    "tweetmsg":$scope.tweetmsg,
    	                  
    	                }
    	            }).success(function(data){
    	                if(data.statusCode==401){
    	                    console.log('unauthorized request, status:401');

    	                }
    	                else
    	                {
    	                    console.log('sucessfully tweeted'); 	                    
    	                      $scope.tweetcount();
    	        	    	  $scope.tweetlist();
    	                }
    	            }).error(function(error){
    	                console.log('error');
    	            })
    	                  	  	

    	        };
  // To get my tweetslist-------- 
    	       $scope.tweetlist=function(){
    	    	   
    	    	  $http.get('/api/mytweets').success(function(data){
    	             console.log("mytweets");
    	             $scope.tweet_list=data.result[0].tweet;
    	             $scope.user=data.result[0].useremail;
    	              console.log(JSON.stringify(data));
    	           }).error(function(err){
    	              console.log(err);
    	           });
    	    	  
    	       };
    	       
// to populate details in update form    	       
    	       $scope.getprofileinfo=function(){
    	    	   
     	    	  $http.get('/api/getupdatedetails').success(function(data){
     	             console.log("update details");
     	             $scope.contact=data.result[0].contact;
     	             $scope.twitter_handle=data.result[0].twitterhandle;
     	             $scope.birthday=data.result[0].dob;
     	             $scope.location=data.result[0].location;
     	              console.log(JSON.stringify(data));
     	           }).error(function(err){
     	              console.log(err);
     	           });
     	    	  
     	       };    	       
    	        
 // To get tweet count
    	       $scope.tweetcount=function(){
    	    	   	$http.get('/api/gettweetcount').success(function(data){
    	    	   		console.log("tweet count");
    	    	   		$scope.tweetcountval=data.result[0].tweetcount;
    	    	   		console.log(JSON.stringify(data));
    	    	   	}).error(function(err){
      	            console.log(err);
      	          });
    	    	  
    	       };
    	    	  
// To get following recommendations--------  
    	    $scope.followlist=function(){
    	    	
    	    	  $http.get('/api/allotherusers').success(function(data){
    	            console.log("allother users");
    	             $scope.follow_list=data.result;
    	              console.log(JSON.stringify(data));
    	          }).error(function(err){
    	            console.log(err);
    	          }); 
    	    	  
    	    };
 
//to get the list of my ppl i'm following    	    
    	    $scope.myfollowinguserslist=function(){
    	    	
  	    	  $http.get('/api/myfollowingusers').success(function(data){
  	            console.log("myfollowingusers users");
  	             $scope.myfollowing_list=data.result;
  	              console.log(JSON.stringify(data));
  	          }).error(function(err){
  	            console.log(err);
  	          }); 
  	    	  
  	    };
    	    	  
 //to follow other user   	    	  
    	    	  $scope.followuser = function(otheruser){
       	    	   console.log("following user");
       	            $http({
       	                method: "POST",
       	                url : '/follow',
       	                data : {
       	                    "isfollowing":otheruser,
       	                  
       	                }
       	            }).success(function(data){
       	                if(data.statusCode==401){
       	                    console.log('unauthorized request, status:401');

       	                }
       	                else
       	                {
       	                    console.log('sucessfully follow');
       	                    $scope.followingcount();
       	                    $scope.followlist();

       	                }
       	            }).error(function(error){
       	                console.log('error');
       	            })
       	                  	  	

       	        };

    	  	 
       	        
//to get the following count
       	        
       	        $scope.followingcount = function(){
        	    	  $http.get('/api/isfollowing').success(function(data){
        	  	            console.log("following users count");
        	  	            console.log(data);
        	  	             $scope.following_count=data.result[0].followcount;
        	  	              console.log(JSON.stringify(data));
        	  	          }).error(function(err){
        	  	            console.log(err);
        	  	          });
       	        	
       	        };
       	        
       	      $scope.followercount = function(){  
       	        $http.get('/api/followers').success(function(data){
	  	            console.log("followers count");
	  	             $scope.followers=data.result[0].followerscount;
	  	              console.log(JSON.stringify(data));
	  	          }).error(function(err){
	  	            console.log(err);
	  	          });
       	      };
// to display tweets of followers  	    	 
  	    	  $scope.retweets = function(){
  	    		  $http.get('/api/followertweets').success(function(data){
  	    			  		console.log("followertweets ");
  	    			  		$scope.retweetlist=data.result;
  	    			  		console.log(JSON.stringify(data));
	  	          		  }).error(function(err){
	  	          			console.log(err);
	  	          		  });  
  	    	  };
  	    	  
 // to retweet a follower tweet 	    	  
  	    	  $scope.willretweet = function(retweet,tweetof){
  	    		  
  	    		console.log("i will retweet");
   	            $http({
   	                method: "POST",
   	                url : '/willretweet',
   	                data : {
   	                    "tweettext":retweet,
   	                     "tweetof":tweetof
   	                  
   	                }
   	            }).success(function(data){
   	                if(data.statusCode==401){
   	                    console.log('unauthorized request, status:401');

   	                }
   	                else
   	                {
   	                    console.log('sucessfully follow');
   	                    $scope.tweetlist();
   	                    $scope.retweets();
   	                    $scope.tweetcount();
   	                    
   	                }
   	            }).error(function(error){
   	                console.log('error');
   	            });  	                    		  
  	    		  
  	    		  
  	    	  };
  	    	  
  	    	  
   	       $scope.myfollowerslist=function(){
	    	   
 	    	  $http.get('/api/myfollowerslist').success(function(data){
 	             console.log("myfollowers");
 	             $scope.followers_list=data.result;
 	              console.log(JSON.stringify(data));
 	           }).error(function(err){
 	              console.log(err);
 	           });
 	    	  
 	       };
 	       
 	       
 	      
 	     $scope.search = function(key){
	    	   console.log("search");
	            $http({
	                method: "POST",
	                url : '/hash',
	                data : {
	                    "key":key,
	                  
	                }
	            }).success(function(data){
	                if(data.status==401){
	                    console.log('unauthorized request, status:401');

	                }
	                else
	                {
	                    console.log('sucessfully tweeted');
	        	 /*   	  $http.get('/api/gettweetcount').success(function(data){
	          	            console.log("tweet count tweetmsg method");
	          	             $scope.tweetcount=data.result[0].tweetcount;
	          	              console.log(JSON.stringify(data));
	          	          }).error(function(err){
	          	            console.log(err);
	          	          });*/
	                    $scope.hash_list=data.result;

	                }
	            }).error(function(error){
	                console.log('error');
	            })
	                  	  	

	        };
	        
	        $scope.hashlist=function(){
       	   	  $http.get('/api/gethashval').success(function(data){
	            console.log("tweet count hash method");
	             $scope.hash_list=[{useremail:"akash",tweet_messaege:"something"},
	                               {useremail:"akash",tweet_messaege:"something"},
	                               {useremail:"akash",tweet_messaege:"something"},
	                               {useremail:"akash",tweet_messaege:"something"}];            		 
	             
	              console.log(JSON.stringify(data));
	          }).error(function(err){
	            console.log(err);
	          });
	        };
       	       
  	    	/*$scope.anotherval="something";

  	    		$scope.hello=function(dataval){
  	    	
  	    			$scope.anotherval=dataval;
  	    		    console.log($scope.anotherval);
  	    		    $http.get('/gotofollower').success(function(data){
  	    		                                    if (data.statusCode==200) {
  	    		                                    	$scope.anotherval=dataval;
  	    		                                      window.location.assign('/alpha');
  	    		                                    }
  	    		                                    else {
  	    		                                      console.log("something is wrong");
  	    		                                    }

  	    		                           }).error(function(err){
  	    		                             console.log(err);
  	    		                           }); 

  	    		};
  	    		
*/  	    		//console.log($scope.anotherval);
  	    		

   }])
   
 
    
      
    
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){
	
	it('to logout', function(done){
		request.post('http://localhost:3000/logout',
				 function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
	it('to follow other', function(done){
		request.post('http://localhost:3000/follow',
				{form:{isfollowing:"test@abc"}}, function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});

	
	it('will go to followers page', function(done){
		request.get('http://localhost:3000/followers', function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
	it('will go to update page', function(done){
		request.get('http://localhost:3000/editprofile', function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
	it('goes to my tweet page', function(done){
		http.get('http://localhost:3000/tweets', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	
});
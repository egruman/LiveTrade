// import { Logger } from './utils'
// import { EventEmitter } from 'events';


var express = require('express');
var router = express.Router();
var mongod = require('mongodb');
var mongo = mongod.MongoClient;
var assert = require('assert');
var session = require('express-session')
var app = express();
var userinfo = null;
var appid = 'a23d2e70daa641aab7cedac82b730033';
var appcertificate = '53f2edf78b504766857d7ce933ee4196';
var url = 'mongodb://localhost:27017';
// var signal = new Signal(appid);
// app.use(session({secret: "abc", resave: false, saveUninitialized: true}))
/* GET home page. */

var md5 = require("md5");



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get-user', function(req, res, next) {
	var user = userinfo;
	res.json(user);
});

router.post('/logout', function(req, res, next) {
	userinfo=null;
	res.redirect('/');
});

router.get('/get-data', function(req, res, next) {
	var products = [];
	mongo.connect(url, function(err, cli) {
		assert.equal(null, err);
		var db =cli.db('test');
		var cursor = db.collection('productdata').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			products.push(doc);
		}, function(){
			res.json(products);
			cli.close();
		});
	});
});

router.post('/insert',function(req,res,next){
	mongo.connect(url, function(err, cli){
		assert.equal(null,err);
		var db =cli.db('test');
		req.body['user'] = userinfo.username;
		req.body['number'] = userinfo.number;
		db.collection('productdata').insertOne(req.body, function(err, result){
			assert.equal(null, err);
			// console.log("help: "+req.body.item);
			cli.close();
		});
	});
	res.redirect('http://localhost:8080');
});

router.post('/edit',function(req,res,next){
	var prod =req.body.id;
	var o_id = new mongod.ObjectID(prod);
	console.log("prod")
	console.log(prod)
	mongo.connect(url, function(err, cli){
		assert.equal(null,err);
		var db =cli.db('test');
		db.collection('productdata').deleteOne({_id : o_id}, function(err, result){
			assert.equal(null, err);
			// console.log("help: "+req.body.item);
			cli.close();
		});
	});
	res.redirect('/');
});

router.post('/signup',function(req,res,next){
	var usern = req.body.user;
	var pass = req.body.pass;
	var eml =  req.body.email;
	mongo.connect(url, function(err, cli) {
		assert.equal(null, err);
		var db =cli.db('test');
		db.collection('users').findOne({username: usern}, function(err, user)
		{
			if(err){
				console.log(err);
				return res.status(500).send();
			} else if(user) {
				return res.status(404).send();
			}
			var count = db.collection('user').count();
			db.collection('user').insertOne({username: usern, password: pass, email: eml, number: count}, function(err, result){
				assert.equal(null, err);
				// console.log("help: "+req.body.item);
				cli.close();
			});
			res.redirect('/');
			return res.status(200).send();
		});
	});
});

router.post('/login',function(req,res,next){
	var usern = req.body.user;
	var pass = req.body.pass;
	mongo.connect(url, function(err, cli) {
		assert.equal(null, err);
		var db =cli.db('test');
		db.collection('user').findOne({username: usern, password: pass}, function(err, user)
		{
			if(err){
				console.log(err);
				res.redirect('/');
				return res.status(500).send();
			} else if(!user) {
				console.log("not found");
				res.redirect('/');
				return res.status(404).send();
			}
			// account =userinfo.username;
			// validTimeInSeconds=100;
			// var SignalingToken = {};
			// SignalingToken.get = function(appid, appcertificate, account, validTimeInSeconds){
			//     var expiredTime = parseInt(new Date().getTime() / 1000)+ validTimeInSeconds;
			//     var token_items = [];

			//     //append SDK VERSION
			//     token_items.push("1");

			//     //append appid
			//     token_items.push(appid);

			//     //expired time
			//     token_items.push(expiredTime);

			//     //md5 account + appid + appcertificate + expiredtime
			//     token_items.push(md5(account + appid + appcertificate + expiredTime));

			//     return token_items.join(":");
			// }

			// //convenience function to get token valid within 1 day
			// SignalingToken.get1DayToken = function(appid, appcertificate, account){
			//     return SignalingToken.get(appid, appcertificate, account, 3600 * 24);
			// }

			// module.exports = SignalingToken;
			// signal.login(userinfo.username,token);

			userinfo =user;
			
			console.log("user");
			res.redirect('/');
			return res.status(200).send();
		});
	});
});

router.post('/update',function(req,res,next){
	
});
// router.post('/agora',function(req,res,next){
// 	signal.channelInviteUser2(userinfo.username+"::channel",req.seller,0);
// }

// router.post('/agora',function(req,res,next){
// 	res.redirect('http://localhost:8080');
// }

// channelInviteAccept(String channelID,String account,int uid,String extra);


module.exports = router;

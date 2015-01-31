var express=require('express');
var bodyParser=require('body-parser');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var service=require('./service');
var ObjectID = require('mongodb').ObjectID;

var app=express();

app.use(bodyParser.json());

app.use(express.static('public'));

var db=new Db('dashDb',new Server('localhost',27017),{safe:true});
db.open(function (error,db) {
	if (error) {
		console.log('error occured while opening connection to database');
	} else {

		app.get('/members',function (request,response) {
			service.getMembers(db)
			.then(function (members){
				response.send(members);
			},function (error){
				response.status(500).send(error)
			});
		});

		app.post('/updateOwner',function (request,response) {
			service.updateOwner(db,request.body.memberId,request.body.passphrase,{
				shift:request.body.shift,
				year:request.body.year,
				month:request.body.month,
				day:request.body.day
			})
			.then(function (message){
				response.send(message)
			},function (error){
				if (error=='passphrase-incorrect') {
					response.status(409).send(error);
				} else {
					response.status(500).send(error);
				}
			});
		});

		app.get('/getOwner',function (request,response) {
			service.getOwner(db,{
				"shift":request.query.shift,
				"year":parseInt(request.query.year),
				"month":parseInt(request.query.month),
				"day":parseInt(request.query.day)
			})
			.then(function (owner){
				response.send(owner);
			},function (error){
				response.status(500).send(error);
			});
		});

		app.post('/authorizeRosterEdit',function (request,response) {
			service.authenticateMember(db,'admin',request.body.passphrase)
			.then(function (message){
				response.send(message);
			},function (error){
				if (error=='passphrase-incorrect' || error=='admin-passphrase-incorrect') {
					response.status(409).send(error);
				} else {
					response.status(500).send(error);
				}
			});
		});

		app.post('/enter',function (request,response) {
			service.enterAttendance(db,request.body.memberId,request.body.passphrase)
			.then(function (message){
				response.send(message);
			},function (error){
				if (error=='passphrase-incorrect' || error=='attendance-already-marked') {
					response.status(409).send(error);
				} else {
					response.status(500).send(error);
				}
			});
		});

		app.post('/deleteEntry',function (request,response) {
			service.deleteEntry(db,request.body.memberId,{
				shift:request.body.shift,
				year:request.body.year,
				month:request.body.month,
				day:request.body.day
			})
			.then(function (message){
				response.send(message);
			},function (error){
				response.status(500).send(error);
			});
		});

		app.get('/shiftDetails',function (request,response) {
			response.send(service.getShiftDetails());
		});

		app.get('/membersInShift',function (request,response) {
			service.getMembersInShift(db,{
				shift:request.query.shift,
				year:parseInt(request.query.year),
				month:parseInt(request.query.month),
				day:parseInt(request.query.day)
			})
			.then(function (members){
				response.send(members);
			},function (error){
				response.status(500).send(error);
			});
		});

		app.get('/report',function (request,response) {
			var startDate=new Date(parseInt(request.query.startYear),parseInt(request.query.startMonth),parseInt(request.query.startDay));
			var endDate=new Date(parseInt(request.query.endYear),parseInt(request.query.endMonth),parseInt(request.query.endDay));
			service.getReport(db,startDate,endDate)
			.then(function (report){
				response.send(report);
			},function (error){
				response.status(500).send(error);
			});
		});

		app.listen(8000,function () {
			console.log('server listening at port 8000');
		});
	}
});

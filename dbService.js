var Promise = require('bluebird');

var get = function (db,collection,pattern) {
	return new Promise(function (resolve,reject) {
		db.collection(collection).find(pattern).toArray(function (error,result) {
			if (error) {
				reject();
			} else {
				resolve(result);
			}
		});
	});
};

var getOne = function (db,collection,pattern) {
	return new Promise(function (resolve,reject) {
		db.collection(collection).findOne(pattern,function (error,result) {
			if (error) {
				reject();
			} else {
				resolve(result);
			}
		});
	});
};

var update = function (db,collection,pattern,setterObject) {
	return new Promise(function (resolve,reject) {
		db.collection(collection).update(pattern,setterObject,function (error) {
			if (error) {
				reject();
			} else {
				resolve();
			}
		});
	});
};

var insert = function (db,collection,object) {
	return new Promise(function (resolve,reject) {
		db.collection(collection).insert(object,function (error) {
			if (error) {
				reject();
			} else {
				resolve();
			}
		});
	});
};

var remove = function (db,collection,pattern) {
	return new Promise(function (resolve,reject) {
		db.collection(collection).remove(pattern,function (error) {
			if (error) {
				reject();
			} else {
				resolve();
			}
		});
	});
};

module.exports=exports={
	get:get,
	getOne:getOne,
	update:update,
	insert:insert,
	remove:remove
};
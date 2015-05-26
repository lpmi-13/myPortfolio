'use strict';

var angular = require('angular');
var $ = require('jquery');
var dataHandler = require('../../services/mockDataHandler');

module.exports = angular.module('myApp.services.dataService', [
	dataHandler.name
])
.service('DataService', function (
	$q,
	$rootScope,
	DataHandler
) {

	return {
		apiRoot: function () {
			return DataHandler.getApiRoot();
		},
		resolve: function (deferred, data) {
			deferred.resolve(data);
		},
		reject: function (deferred, err) {
			deferred.reject(angular.extend({
				_type: '404',
				message: 'unspecified error'
			}, err));
		},
		create: function (url, params) {
			return DataHandler.create(url, params);
		},
		get: function (url, params) {
			return DataHandler.get(url, params);
		},
		update: function (url, params) {
			return DataHandler.update(url, params);
		},
		delete: function (url) {
			return DataHandler.delete(url);
		}
	};
});

/////////////// CLIENT /////////////////

// SomeController       : MonsterController - MonsterService.getMonster(key)

// SomeService          : MonsterService - DataService.get('server/api/monster/someMonsterKey')

// DataService          : DataService - DataHander.get('server/api/monster/someMonsterKey')

// DataHandler          : MockDataHandler or LiveDataHandler - $.ajax({ method: 'GET', url: 'server/api/monster/someMonsterKey' })

//////////// API / SERVER //////////////

// Server               : MyServer - app.get('/server/api/monster/:id', monsterHandler.findById);

// someHandler          : monsterHandler - dataStoreService.findOne('monsters', id, ....);

// DataStoreService     : db.collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) { ...});

// Database             : { someMonsterKey: { name: 'Some Monster', .... } }
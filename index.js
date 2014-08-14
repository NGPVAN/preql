var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var pg = require('pg');


function makeFunction(query){
	return function(queryFunc,fn){
		return queryFunc(query,fn);
	}
}


module.exports = {
	makeQuery: function(file){
		return makeFunction(fs.readFileSync(file).toString());
	},
	makeQueries: function(dir){
		var queries = {}
		function isSql(name){
			return name.slice(-4,name.length) === '.sql';
		}
		var files = fs.readdirSync(dir).filter(isSql);


		var contents = files.map(function(fileName){
			return fs.readFileSync(path.join(dir,fileName)).toString();
		});
		files.forEach(function(fileName,i){
			queries[fileName.slice(0,-4)] = makeFunction(contents[i]);
		});
		return queries;
	}
};

	
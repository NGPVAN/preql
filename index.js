var fs = require('fs');
var path = require('path');


function makeFunction(query){
	return function(queryFunc,fn){
		return queryFunc(query,fn);
	}
}

function isSql(name){
  return name.slice(-4,name.length) === '.sql';
}

function isDir(path){
  return fs.statSync(path).isDirectory()
}


module.exports = {
	makeQuery: function(file){
		return makeFunction(fs.readFileSync(file).toString());
	},
	makeQueries: function(dir){

		var queries = {};

    //cache which are directories to prevent unneeded reads
    var dirs = {};

    //to avoid lexical scoping issues
    var that = this;

		var files = fs.readdirSync(dir).filter(function(file){
      if(isDir(path.join(dir,file))){
        dirs[file] = true;
        return true
      }

      return isSql(file);
    });

		var contents = files.map(function(fileName){
      if(dirs[fileName]){
        return that.makeQueries(path.join(dir,fileName));
      }
			return fs.readFileSync(path.join(dir,fileName)).toString();
		});

		files.forEach(function(fileName,i){
      if(dirs[fileName]){
        queries[fileName] = contents[i];
      }
			queries[fileName.slice(0,-4)] = makeFunction(contents[i]);
		});
		return queries;
	}
};


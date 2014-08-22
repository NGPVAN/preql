var should = require('should');
var norm = require('../index.js');


describe('nORM', function(){
	var sample = norm.makeQuery('./queries/sample.sql');

	it('should generate the correct query function from file', function(done){
		sample(function(query){
			query.should.equal('SELECT NOW() AS "theTime"')
		});
		done();
	});

	it('should pass parameters to the query function', function(done){
		function query(text,obj){
			obj.should.have.property('a',1)
		}
		sample(query,{a: 1});
		done();
	});

	it('should pass callback to the query function', function(done){
		sample(function(text,fn){
			fn.should.be.type('function');
		},function(){});
		done();
	});

	describe('makeQueries', function(){
		var queries = norm.makeQueries('./queries');

		it('should generate queries for directory', function(done){
			queries.sample2(function(query){
				query.should.equal('SELECT 1::int AS number');
			})
			done();
		});

		it('should ignore non-sql files',function(done){
			queries.should.not.have.property('redHerring');
			done();
		});

    it('should recursively generate queries to an arbitrary depth', function(done){
      queries.User.create(function(query){
        query.should.equal('INSERT INTO users VALUES ($name,$email);');
      });
      queries.User.Nested.select(function(query){
        query.should.equal('SELECT * FROM users');
      });
      done();
    });
	});
})
/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    let ids_for_later = [];
  
    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          if (err) { console.log(err) }
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, '_id');
          assert.property(res.body, 'open');
          ids_for_later.push(res.body._id);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in'
          })
          .end(function(err, res){
            if (err) console.log(err);
            assert.equal(res.status, 200);
            assert.isDefined(res.body.issue_title);
            assert.isDefined(res.body.issue_text);
            assert.isDefined(res.body.created_by);
            ids_for_later.push(res.body._id);
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: '',
            created_by: 'Functional Test - Every field filled in'
          })
          .end(function(err, res){
            if (err) console.log(err);
            assert.equal(res.text, 'Missing required fields')
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: '',
            assigned_to: '',
            status_text: '',
          })
          .end(function(err, res){
            if (err) console.log(err);
            assert.equal(res.text, 'no updated field sent')
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: ids_for_later[0],
            issue_title: 'Update this one field',
          })
          .end(function(err, res){
            if (err) console.log(err);
            assert.equal(res.text, 'successfully updated!');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: ids_for_later[1],
            issue_title: 'Update this field',
            issue_text: 'this field as well',
            assigned_to: 'Jim',
          })
          .end(function(err, res){
            if (err) console.log(err);
            assert.equal(res.text, 'successfully updated!');
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: "Functional Test - Every field filled in" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.lengthOf(res.body, 4, '4 issues with created_by == "Functional Test - Every field filled in"');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.property(res.body[1], 'issue_title');
          assert.property(res.body[1], 'issue_text');
          assert.property(res.body[1], 'created_on');
          assert.property(res.body[1], 'updated_on');
          assert.property(res.body[1], 'created_by');
          assert.property(res.body[1], 'assigned_to');
          assert.property(res.body[1], 'open');
          assert.property(res.body[1], 'status_text');
          assert.property(res.body[1], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: "Functional Test - Every field filled in", assigned_to: "Sam" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_title, 'Title');
          assert.equal(res.body[0].assigned_to, "Sam");
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: ''
        })
        .end(function(err, res){
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: ids_for_later[0]
        })
        .end(function(err, res){
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, `success: deleted ${ids_for_later[0]}`);
          done();
        });
      });
      test('Valid _id_2', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: ids_for_later[1]
        })
        .end(function(err, res){
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, `success: deleted ${ids_for_later[1]}`);
          done();
        });
      });
      
    });

});

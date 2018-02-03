const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.spec.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/index', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .get('/index')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

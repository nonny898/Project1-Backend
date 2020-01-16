const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

describe('GET /wc?target=https://curl.haxx.se/', () => {
  //Test for accept JSON
  it('should respond with JSON from setting the accept header', async done => {
    const response = await request
      .get('/wc')
      .query({
        target: 'https://curl.haxx.se/'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    done();
  }); //Test for accept plain text and from cache
  it('should respond with plain text from setting the accept header and from cache', async done => {
    const response = await request
      .get('/wc')
      .query({
        target: 'https://curl.haxx.se/'
      })
      .set('Accept', 'text/plain')
      .expect('Content-Type', /plain/)
      .expect('Cache-Control', 'from-cache')
      .expect(200);
    done();
  });
  //Test for accept HTML and from cache
  it('should respond with HTML from cache', async done => {
    const response = await request
      .get('/wc')
      .query({
        target: 'https://curl.haxx.se/'
      })
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Cache-Control', 'from-cache')
      .expect(200);
    done();
  });
  //Test for accept HTML but not from cache
  it('should respond with HTML but not from cache as force is true', async done => {
    const response = await request
      .get('/wc')
      .query({
        target: 'https://curl.haxx.se/',
        force: 'true'
      })
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Cache-Control', 'no-cache')
      .expect(200);
    done();
  });
  //Test for reporting error
  it('should respond that there is a problem with the target URL', async done => {
    const response = await request.get('/wc').query({
      target: 'google'
    });
    expect(response.status).toBe(500);
    done();
  });
  //Test for page with the content type 'text/plain'
  it('should respond with 200 status', async done => {
    const response = await request.get('/wc').query({
      target: 'https://www-eng-x.llnl.gov/documents/a_document.txt'
    });
    console.log(response.body);
    done();
  });
});

describe('GET /wc?target=https://www-eng-x.llnl.gov/documents/a_document.txt', () => {
  //Test for page with the content type 'text/plain'
  it('should respond with 200 status', async done => {
    const response = await request
      .get('/wc')
      .query({
        target: 'https://www-eng-x.llnl.gov/documents/a_document.txt'
      })
      .expect(200);
    done();
  });
});

describe('GET /wc?target=https://zellwk.com/blog/async-await/, () => {
  //Test for concurrency
  it('should respond with JSON from setting the accept header', async done => {
    const response1 = request
      .get('/wc')
      .query({
        target: 'https://zellwk.com/blog/async-await/'
      })
      .expect(200);
    const response2 = request
      .get('/wc')
      .query({
        target: 'https://zellwk.com/blog/async-await/'
      })
      .expect(200);
    const response3 = request
      .get('/wc')
      .query({
        target: 'https://zellwk.com/blog/async-await/'
      })
      .expect(200);
    const response4 = request
      .get('/wc')
      .query({
        target: 'https://zellwk.com/blog/async-await/'
      })
      .expect(200);
    const response5 = request
      .get('/wc')
      .query({
        target: 'https://zellwk.com/blog/async-await/'
      })
      .expect(200);
    const responds = await Promise.all([
      response1,
      response2,
      response3,
      response4,
      response5
    ]);
    let counter = 0;
    for (res of responds) {
      if (res.header['cache-control'] === 'no-cache') counter++;
    }
    expect(counter).toBe(1);
    done();
  });
});

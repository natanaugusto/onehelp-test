'use strict';

require('../tester');

const RequestFactory = require('../../factories/request.factory');
const Request = require('../../api/requests/request.model');

describe('Test the RequestFactory', () => {
  const user = {
    name: 'Natan',
    email: 'natan@email.com',
  };

  it('Testing the reset data for Requests', async done => {
    const count = 10;
    await new RequestFactory(null, count).create();
    let requests = await Request.find();
    expect(requests.length).toBe(count);

    await new RequestFactory(null, count).resetData();
    requests = await Request.find();
    expect(requests.length).toBe(0);
    done();
  });

  it('Testing create Requests', async done => {
    let request = await new RequestFactory().create();
    expect(typeof request).toBe('object');

    request = await new RequestFactory({ user }).create();
    expect(request.user.name).toBe(user.name);
    expect(request.user.email).toBe(user.email);

    request = await new RequestFactory(null, 5).create();
    expect(request.length).toBe(5);
    done();
  });

  it('Testing make Requests', async done => {
    let request = await new RequestFactory().make();
    expect(typeof request).toBe('object');

    request = await new RequestFactory({ user }).make();
    expect(request.user.name).toBe(user.name);
    expect(request.user.email).toBe(user.email);

    request = await new RequestFactory(null, 5).make();
    expect(request.length).toBe(5);
    done();
  });
});

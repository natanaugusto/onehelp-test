'use strict';

// const MockModel = require('jest-mongoose-mock');
require('../tester');
// jest.mock('../../api/requests/request.model', () => new MockModel());

const RequestFactory = require('../../factories/request.factory');

describe('Test the RequestFactory', () => {
  const user = {
    name: 'Natan',
    email: 'natan@email.com',
  };
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

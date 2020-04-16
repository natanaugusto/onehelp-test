'use strict';

const moment = require('moment');
const tester = require('../tester');
const { pricePerHour } = require('../../config').requests;
const urlPrefix = '/v1/requests';
const jsonp = require('../../utils/jsonp');
const RequestFactory = require('../../factories/request.factory');
const DiscountFactory = require('../../factories/discount.factory');

const handleErr = err => {
  if (err) {
    console.log(err);
  }
};

const beforeRun = async () => {
  await new RequestFactory().resetData();
  await new DiscountFactory().resetData();
};
describe('POST /requests endpoint', () => {
  it('Creating a new cleaning request', async done => {
    await beforeRun();
    const cleaningRequest = await new RequestFactory().make();
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(201);
        expect(res.body.user).toEqual(cleaningRequest.user);
        expect(moment(res.body.data).format('YYYY-MM-DD')).toEqual(
          cleaningRequest.date,
        );
        expect(res.body.duration).toEqual(cleaningRequest.duration);
        expect(res.body.price).toEqual(cleaningRequest.duration * pricePerHour);
        done();
      });
  });

  it('Create a new cleaning request consuming a percentage discount', async done => {
    await beforeRun();
    const cleaningRequest = await new RequestFactory().make();
    const discount = await new DiscountFactory({
      type: 'percent',
      value: 0.2,
      userEmail: cleaningRequest.user.email,
    }).create();
    // Duration * PricePerHour - Price * Discount Percent
    const price =
      cleaningRequest.duration * pricePerHour -
      cleaningRequest.duration * pricePerHour * discount.value;
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(201);
        expect(res.body.user).toEqual(cleaningRequest.user);
        expect(moment(res.body.data).format('YYYY-MM-DD')).toEqual(
          cleaningRequest.date,
        );
        expect(res.body.duration).toEqual(cleaningRequest.duration);
        expect(res.body.price).toEqual(price);
        done();
      });
  });

  it('Create a new cleaning request consuming a absolute discount', async done => {
    await beforeRun();
    const cleaningRequest = await new RequestFactory().make();
    const discount = await new DiscountFactory({
      type: 'absolute',
      value: 15,
      userEmail: cleaningRequest.user.email,
    }).create();
    // Duration * PricePerHour - Discount value
    const price = cleaningRequest.duration * pricePerHour - discount.value;
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(201);
        expect(res.body.user).toEqual(cleaningRequest.user);
        expect(moment(res.body.data).format('YYYY-MM-DD')).toEqual(
          cleaningRequest.date,
        );
        expect(res.body.duration).toEqual(cleaningRequest.duration);
        expect(res.body.price).toEqual(price);
        done();
      });
  });

  it('Create a new cleaning request consuming the bigger discount', async done => {
    await beforeRun();
    const cleaningRequest = await new RequestFactory({ duration: 5 }).make();
    let discounts = [
      {
        type: 'absolute',
        value: 15,
        userEmail: cleaningRequest.user.email,
      },
      {
        type: 'percent',
        value: 0.15,
        userEmail: cleaningRequest.user.email,
      },
    ];
    discounts.forEach(async discount => {
      await await new DiscountFactory(discount).create();
    });
    // Duration * PricePerHour - Price * Discount Percent
    const price =
      cleaningRequest.duration * pricePerHour -
      cleaningRequest.duration * pricePerHour * discounts[1].value;
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(201);
        expect(res.body.user).toEqual(cleaningRequest.user);
        expect(moment(res.body.data).format('YYYY-MM-DD')).toEqual(
          cleaningRequest.date,
        );
        expect(res.body.duration).toEqual(cleaningRequest.duration);
        expect(res.body.price).toEqual(price);
        done();
      });
  });
});

describe('GET /requests endpoint', () => {
  it('Get all requests', async done => {
    await beforeRun();
    // create 10 requests
    let requests = jsonp(await new RequestFactory(null, 20).create());
    tester
      .get(urlPrefix)
      .set('Accept', 'application/json')
      .expect(200, requests, done);
  });
});

describe('PUT /requests/{id}', () => {
  beforeRun();
  it('Update a cleaning request', async done => {
    const request = jsonp(await new RequestFactory().create());
    const duration =
      request.duration < 8 ? request.duration++ : request.duration--;
    tester
      .put(`${urlPrefix}/${request._id}`)
      .set('Accept', 'application/json')
      .send({ duration })
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(201);
        expect(res.body._id).toEqual(request._id.toString());
        expect(res.body.duration).toEqual(duration);
        done();
      });
  });

  it('Update a non existent cleaning request', async done => {
    tester
      .put(`${urlPrefix}/5e975facfb775a004229a892`)
      .set('Accept', 'application/json')
      .send({ duration: 8 })
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(404);
        done();
      });
  });
});

describe('DELETE /requests/{id}', () => {
  it('Delete a cleaning request', async done => {
    const request = jsonp(await new RequestFactory().create());

    tester
      .del(`${urlPrefix}/${request._id}`)
      .set('Accept', 'application/json')
      .query({ id: request._id })
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(204);
        done();
      });
  });

  it('Delete a non existent cleaning request', async done => {
    tester
      .put(`${urlPrefix}/5e975facfb775a004229a892`)
      .set('Accept', 'application/json')
      .send({ duration: 8 })
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(404);
        done();
      });
  });
});

describe('PATCH /requests', () => {
  it('Update many cleaning request', async done => {
    await beforeRun();
    const requests = jsonp(await new RequestFactory(null, 5).create());
    requests.forEach((request, index) => {
      request.duration = 8;
      requests[index] = request;
    });

    tester
      .patch(urlPrefix)
      .set('Accept', 'application/json')
      .send(requests)
      .expect(204);

    tester
      .patch(urlPrefix)
      .set('Accept', 'application/json')
      .send([
        {
          _id: 'no-exists',
          empty: 'empoty',
        },
      ])
      .expect(403);
    done();
  });
});

describe('GET /requests/last-update', () => {
  it('should show the last time a request cleaning was created or updated', async done => {
    const lastUpdate = jsonp(await new RequestFactory().create()).updatedAt;

    tester
      .get(`${urlPrefix}/last-update`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(200);
        expect(res.body.lastUpdate).toEqual(lastUpdate.toISOString());
        done();
      });
  });

  it('should show the lastest discounts was created or updated', async done => {
    const requests = jsonp(await new RequestFactory(null, 10).create());
    tester
      .get(`${urlPrefix}/last-update`)
      .query({ since: requests[6].updatedAt })
      .set('Accept', 'application/json')
      .end((err, res) => {
        handleErr(err);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(3);
        done();
      });
  });
});

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
        expect(201).toEqual(res.status);
        expect(cleaningRequest.user).toEqual(res.body.user);
        expect(cleaningRequest.date).toEqual(
          moment(res.body.data).format('YYYY-MM-DD'),
        );
        expect(cleaningRequest.duration).toEqual(res.body.duration);
        expect(cleaningRequest.duration * pricePerHour).toEqual(res.body.price);
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
        expect(201).toEqual(res.status);
        expect(cleaningRequest.user).toEqual(res.body.user);
        expect(cleaningRequest.date).toEqual(
          moment(res.body.data).format('YYYY-MM-DD'),
        );
        expect(cleaningRequest.duration).toEqual(res.body.duration);
        expect(price).toEqual(res.body.price);
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
        expect(201).toEqual(res.status);
        expect(cleaningRequest.user).toEqual(res.body.user);
        expect(cleaningRequest.date).toEqual(
          moment(res.body.data).format('YYYY-MM-DD'),
        );
        expect(cleaningRequest.duration).toEqual(res.body.duration);
        expect(price).toEqual(res.body.price);
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
        expect(201).toEqual(res.status);
        expect(cleaningRequest.user).toEqual(res.body.user);
        expect(cleaningRequest.date).toEqual(
          moment(res.body.data).format('YYYY-MM-DD'),
        );
        expect(cleaningRequest.duration).toEqual(res.body.duration);
        expect(price).toEqual(res.body.price);
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
        expect(201).toEqual(res.status);
        expect(request._id.toString()).toEqual(res.body._id);
        expect(duration).toEqual(res.body.duration);
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
        expect(404).toEqual(res.status);
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
        expect(204).toEqual(res.status);
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
        expect(404).toEqual(res.status);
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
  it('should show the last time a discount was created or updated', async done => {
    const lastUpdate = jsonp(
      await new RequestFactory().create(),
    ).updatedAt.toISOString();
    tester
      .get(`${urlPrefix}/last-update`)
      .set('Accept', 'application/json')
      .expect(200, { lastUpdate }, done);
  });
});

import supertest from 'supertest'
import {Response, SuperTest, Test} from 'supertest'
import { BAD_REQUEST, CREATED, OK, NO_CONTENT, NOT_FOUND } from 'http-status-codes'

import app from '@server'
import jsonp from '@shared/jsonp'
import DiscountFactory from '@daos/Discount/DiscountFactory'
import DiscountDao from '@daos/Discount/DiscountDao'
import { pErr } from '@shared/functions'

describe('Discounts Routes', () => {
    const discountsPath = '/v1/discounts'

    let agent: SuperTest<Test>
    beforeAll((done) => {
        agent = supertest.agent(app)
        done()
    })

    describe(`GET:${discountsPath}`, () => {
        it('should list all discounts', async (done) => {
            await new DiscountFactory(10).create()
            const discounts = jsonp(await DiscountDao.find())
            agent.get(discountsPath)
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toBe(OK)
                    expect(res.body).toEqual(discounts)
                    done()
                })
        })
    })

    describe(`POST: ${discountsPath}`, () => {
        it('should create a new discount', (done) => {
            const discount = new DiscountFactory().make()
            agent.post(discountsPath)
                .send(discount)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED)
                    expect(res.body.userEmail).toBe(discount.userEmail)
                    done()
                })
        })
    })

    describe(`PUT: ${discountsPath}`, () => {
        it('should update a discount', async (done) => {
            const discount = jsonp(await new DiscountFactory().create())
            const value = 10
            agent.put(`${discountsPath}/${discount._id}`)
                .send({value})
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toEqual(CREATED)
                    expect(res.body._id).toEqual(discount._id.toString())
                    expect(res.body.value).toEqual(value)
                    done()
                })
        })

        it('should update a non existent discount', async (done) => {
            const value = 10
            agent.put(`${discountsPath}/5e94779e2799fa0022ab9168`)
                .send({value})
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toEqual(NOT_FOUND)
                    done()
                })
        })
    })

    describe(`DELETE: ${discountsPath}`, () => {
        it('should delete a discount', async (done) => {
            const discount = jsonp(await new DiscountFactory().create())
            agent.del(`${discountsPath}/${discount._id}`)
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toEqual(NO_CONTENT)
                    done()
                })
        })
    })

    describe(`PATH: ${discountsPath}`, () => {
        it('should update multiples discounts', async (done) => {
            const discounts = jsonp(await new DiscountFactory(10).create())
            const discountsToUpdate: Array<Object> = []
            discounts.map((discount: any) => {
                const {_id, value} = discount
                discountsToUpdate.push({
                    _id,
                    value: value + 1
                })
            })
            agent.patch(discountsPath)
                .send(discountsToUpdate)
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toEqual(NO_CONTENT)
                    done()
                })
        })
    })

    describe(`GET ${discountsPath}/last-update`, () => {
        it ('should show the last time a discount was created or updated', async (done) => {
            const lastUpdate = jsonp(await new DiscountFactory().create()).updatedAt.toISOString()

            agent.get(`${discountsPath}/last-update`)
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toEqual(OK)
                    expect(res.body).toEqual({lastUpdate})
                    done()
                })
        })

        it ('should show the lastest 3 discounts created or updated', async (done) => {
            const discounts = jsonp(await new DiscountFactory(10).create())

            agent.get(`${discountsPath}/last-update`)
                .query({since: discounts[6].updatedAt})
                .end((err: Error, res: Response) => {
                    pErr(err)
                    expect(res.status).toEqual(OK)
                    expect(res.body.length).toEqual(3)
                    done()
                })
        })
    })
})

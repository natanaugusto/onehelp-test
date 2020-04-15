import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from 'http-status-codes'
import jsonp from '@shared/jsonp'
import DiscountDao from '@daos/Discount/DiscountDao'

const ObjectId = mongoose.Types.ObjectId

class DiscountController {
    async create(req: Request, res: Response) {
        const discount = req.body
        await DiscountDao.create(discount)
        return res.status(CREATED).end()
    }

    async list(req: Request, res: Response) {
        const discounts = await DiscountDao.find()
        return res.status(OK).json(discounts)
    }

    async update(req: Request, res: Response) {
        await DiscountDao.updateOne(
            {_id: new ObjectId(req.params.id)},
            { $set: req.body }
        )
        return res.status(NO_CONTENT).end()
    }

    async delete(req: Request, res: Response) {
        await DiscountDao.deleteOne({_id: new ObjectId(req.params.id)})
        return res.status(NO_CONTENT).end()
    }

    patch(req: Request, res: Response) {
        req.body.map(async (discount: any) => {
            const id = new ObjectId(discount._id)
            delete discount._id
            await DiscountDao.updateOne(
                {_id: id},
                { $set: discount }
            )
        })
        return res.status(NO_CONTENT).end()
    }

    async lastUpdate(req: Request, res: Response) {
        const lastUpdate = jsonp(await DiscountDao.findOne().sort([['updatedAt', -1]])).updatedAt
        res.status(OK).json({lastUpdate})
    }
}

export default DiscountController

import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { BAD_REQUEST, CREATED, OK, NO_CONTENT, NOT_FOUND } from 'http-status-codes'
import jsonp from '@shared/jsonp'
import DiscountDao from '@daos/Discount/DiscountDao'

const ObjectId = mongoose.Types.ObjectId

class DiscountController {
    async create(req: Request, res: Response) {
        const discount = await DiscountDao.create(req.body)
        return res.status(CREATED).json(discount)
    }

    async list(req: Request, res: Response) {
        const discounts = await DiscountDao.find()
        return res.status(OK).json(discounts)
    }

    async update(req: Request, res: Response) {
        const id = new ObjectId(req.params.id);
        const update = await DiscountDao.updateOne(
            {_id: id},
            { $set: req.body }
        )
        if (!update.n) {
            return res.status(NOT_FOUND).end()
        }
        return res.status(CREATED).json(await DiscountDao.findById(id))
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

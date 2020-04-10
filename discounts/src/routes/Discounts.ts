import { Router } from 'express'
import DiscountController from '@controllers/DiscountController'

const router = Router()
const controller = new DiscountController()

router.post('/', controller.create)
router.get('/', controller.list)
router.patch('/', controller.patch)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router

import { Router } from 'express'
import DiscountRouter from './Discounts'

// Init router and path
const router = Router()

// Add sub-routes
router.use('/discounts', DiscountRouter)

// Export the base-router
export default router

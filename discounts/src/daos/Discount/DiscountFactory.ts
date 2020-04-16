import { Document, Model } from 'mongoose'
import faker from 'faker'
import Factory from '@shared/Factory'
import DiscountDao from '@daos/Discount/DiscountDao'

class DiscountFactory extends Factory {
    model(): Model<Document> {
        return DiscountDao
    }

    schema(): Object {
        return {
            type: faker.random.arrayElement(['absolute', 'percent']),
            value: faker.random.number(10),
            userEmail: faker.internet.email().toLowerCase(),
        }
    }
}

export default DiscountFactory

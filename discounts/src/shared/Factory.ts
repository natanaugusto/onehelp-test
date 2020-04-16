import { Document, Model } from 'mongoose'
/**
 * Class to help factory Faker Entities
 */
abstract class Facotry {
    count: Number
    defaultValues?: Object

    abstract model(): Model<Document>
    abstract schema(): Object

    /**
     * Construct the class
     * @param {integer} count Quantity of elements to be created
     * @param {object} defaultValues Object like the schema for pass the default values to be used on generate
     */
    constructor(count: Number = 1, defaultValues?: Object) {
        this.count = count
        this.defaultValues = defaultValues
    }

    /**
     * Create a Document
     */
    async create() {
        let result
        if (this.count > 1) {
            result = []
            for (let i = 0; i < this.count; i++) {
            let entity = await this.modelCreate(this.mergeSchema(this.schema()))
            result.push(entity)
            }
        } else {
            result = await this.modelCreate(this.mergeSchema(this.schema()))
        }

        return result
    }

    /**
     * Make the objects without persist the data
     * @returns {object}
     */
    make() {
        let result
        if (this.count > 1) {
            result = []
            for (let i = 0; i < this.count; i++) {
                let entity = this.mergeSchema(this.schema())
                result.push(entity)
            }
        } else {
            result = this.mergeSchema(this.schema())
        }

        return result
    }

    /**
     * Merge the schema with the defaultValues passed on construction
     * @param {object} schema
     * @returns {object}
     */
    mergeSchema(schema: Object): any {
        if (this.defaultValues) {
            schema = Object.assign(schema, this.defaultValues)
        }
        return schema
    }

    /**
     * Create a new model and persist the data
     * @param values 
     */
    async modelCreate(values: Object): Promise<Document> {
        const created = await this.model().create(values)
        return created
    }

    /**
     * Drop all database
     * !!!! CAUTION !!!!
     * This method will drop all the data
     * Just use on test mode
     * !!!! CAUTION !!!!
     */
    async resetData() {
        await this.model().deleteMany({})
    }
}


export default Facotry

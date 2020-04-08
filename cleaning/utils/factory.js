'use strict';
/**
 * Class to help factory Faker Entities
 */
class Factory {
  /**
   * Return the model
   */
  model() {}
  /**
   * Construct the class
   * @param {object} defaultValues Object like the schema for pass the default values to be used on generate
   * @param {integer} count Quantity of elements to be created
   */
  constructor(defaultValues, count) {
    this.defaultValues = defaultValues;
    this.count = count;
  }

  /**
   * Create the model and persist the data
   * @returns {object}
   */
  async create() {
    let result;
    if (this.count) {
      result = [];
      for (let i = 0; i < this.count; i++) {
        let entity = await this.modelCreate(this.mergeSchema(this.schema()));
        result.push(entity);
      }
    } else {
      result = await this.modelCreate(this.mergeSchema(this.schema()));
    }

    return result;
  }

  /**
   * Make the objects without persist the data
   * @returns {object}
   */
  make() {
    let result;
    if (this.count) {
      result = [];
      for (let i = 0; i < this.count; i++) {
        let entity = this.mergeSchema(this.schema());
        result.push(entity);
      }
    } else {
      result = this.mergeSchema(this.schema());
    }

    return result;
  }

  /**
   * Merge the schema with the defaultValues passed on construction
   * @param {object} schema
   * @returns {object}
   */
  mergeSchema(schema) {
    if (this.defaultValues) {
      schema = Object.assign(schema, this.defaultValues);
    }
    return schema;
  }

  /**
   * Returns a generated schema
   * (This method must be implemented on the child class)
   */
  schema() {}

  /**
   * Create a new model and persist the data
   * (This method must be implemented on the child class)
   * @param {*} values
   */
  async modelCreate(values) {
    const created = await this.model().create(values);
    return created;
  }

  /**
   * Drop all database
   * !!!! CAUTION !!!!
   * This method will drop all the data
   * Just use on test mode
   * !!!! CAUTION !!!!
   */
  async resetData() {
    await this.model().deleteMany();
  }
}
module.exports = Factory;

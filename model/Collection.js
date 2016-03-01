// import _ from 'underscore';

class Collection {

    constructor(type, items) {
        if (arguments.length !== 2) {
            throw new Error('Type and Items must be specified to initialize a collection.');
        }

        this.Items = items.map((item) => new type(item));
        this.type = type;

        return this.Items;
    }

    /**
     * Return all items in collection
     * @return {array} All items in collection
     */
    get all() {
        return () => this.Items;
    }

    /**
     * Find items in collection by ID defined in model
     * @return {[type]} Model
     */
    get findByID() {
        return (id) => {
            var result = this.Items.filter( (item) => item[this.type.uniqueIdentifier] );
            return result.length === 1 ? result[0] : undefined;
        }
    }

    /**
     * Return array items that matches arguments
     * @return {array} items that matches arguments
     */
    get findWhere() {
        // return (args = {}) => _.findWhere(this.Items, args);
    }
}

export default Collection
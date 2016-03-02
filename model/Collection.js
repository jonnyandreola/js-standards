class Collection extends Array {

    constructor(type, items) {
        if (arguments.length !== 2) {
            throw new Error('Type and Items must be specified to initialize a collection.');
        }

        super(...items.map((item) => new type(item)));
        this._type = type;
        this.findByID = Collection.findByID(this);
    }

    /**
     * Find items in collection by ID defined in model
     * @return {[type]} Model
     */
    static findByID(array) {
        return (id) => {
            var result = array.find( (item) => item[array._type.uniqueIdentifier]() === id );
            return result;
        }
    }

    static removeByID(array) {
        return (id) => {

        }
    }
}

export default Collection
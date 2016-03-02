class Collection extends Array {

    constructor(items, type) {
        if (arguments.length !== 2) {
            throw new Error('Type and Items must be specified to initialize a collection.');
        }
        let Items = items.map((item) => new type(item));
        super(...Items);
        this._type = type;
        this.findByID = Collection.findByID(this);
        this.removeByID = Collection.removeByID(this);
    }

    /**
     * Find item in collection by ID defined in model
     * @return {Model}
     */
    static findByID(array) {
        return (id) => {
            var result = array.find( (item) => item[array._type.uniqueIdentifier]() === id );
            return result;
        }
    }

    /**
     * Remove item in collection by ID defined in model
     * @return {Model}
     */
    static removeByID(array) {
        return (id) => {
            var found;
            for (let i = 0; i < array.length; i++) {
                if (array[i][array._type.uniqueIdentifier]() === id) {
                    found = i;
                    break;
                }
            }

            if (found > -1) {
                return array.splice(found, 1);
            }
        }
    }
}

export default Collection
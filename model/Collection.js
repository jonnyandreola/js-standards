class Collection extends Array {

    constructor(items, Type) {
        if (arguments.length !== 2) {
            throw new Error('Type and Items must be specified to initialize a collection.');
        }
        let Items = items.map((item) => new Type(item));
        super(...Items);
        this._type = Type;
        this.findByID = Collection.findByID(this);
        this.removeByID = Collection.removeByID(this);
    }

    /**
     * Find item in collection by ID defined in model
     * @return {Model}
     */
    static findByID(array) {
        return (id) => {
            let intID = parseInt(id);
            let result = array.find( (item) => item[array._type.uniqueIdentifier]() === intID );
            return result;
        };
    }

    /**
     * Remove item in collection by ID defined in model
     * @return {Model}
     */
    static removeByID(array) {
        return (id) => {
            let intID = parseInt(id);
            let found;
            for (let i = 0; i < array.length; i++) {
                if (array[i][array._type.uniqueIdentifier]() === intID) {
                    found = i;
                    break;
                }
            }

            if (found > -1) {
                return array.splice(found, 1);
            }
        };
    }
}

export default Collection;
import m from 'mithril';

class BaseModel {

    constructor (args) {
        // Model state
        this._isLoading = BaseModel.setValue(false, 'bool');

        // Model unique item identifier
        this._uniqueIdentifier = BaseModel.setValue(args._uniqueIdentifier, 'string', 'id');

        // Reference to subclass
        this._type = BaseModel.setValue(args._type, 'function');
    }

    ////////////////////
    // STATIC METHODS //
    ////////////////////
    /**
     * Fetch items for a given resource
     * @param  {object} args query params
     * @return {Promise}
     */
    static list(type, args) {
        console.log('Query called:', type.url, args);
        return m.request({
            method: 'GET',
            url: type.url,
            unwrapSuccess: function(response) {
                return response.Entries;
            }
        });
    }

    /**
     * Sets a m.prop with passed value, also will type cast/check, if type does
     * not match will throw errors but will not crash the application
     * if no value is passed it will use the second argument (defaultValue)
     * fallbacks to false if nothing is provided
     * @param {any}  value        value to be set in returned m.prop
     * @param {string} type       type of value
     * @param {any} defaultValue  default value to be used if no value  is passed
     * @return {function}
     */
    static setValue(value, type, defaultValue = false) {
        let initialValue = value !== undefined
            ? value
            : defaultValue;
        let normalizedValue;
        
        try {
            switch (type) {
                case 'any' :
                    normalizedValue = initialValue;
                    break;
                case 'bool' :
                    normalizedValue = !!initialValue;
                    break;
                case 'int' :
                    normalizedValue = parseInt(initialValue, 10);
                    break;
                case 'float' :
                    normalizedValue = parseFloat(initialValue);
                    break;
                case 'string' :
                    normalizedValue = "" + initialValue + "";
                    break;
                case 'array' :
                    if (!Array.isArray(initialValue)) {
                        throw new TypeError(`${initialValue} is not type Array.`);
                    }
                    break;
                case 'object' :
                    if (initialValue !== Object(initialValue)) {
                        throw new TypeError(`${initialValue} is not type Object.`);
                    }
                    break;
                case 'function' :
                    if (typeof initialValue !== 'function') {
                        throw new TypeError(`${initialValue} is not type Function.`);
                    }
                    break;
                default :
                    if (typeof type === 'function') {
                        if (!value) return normalizedValue = defaultValue;
                        normalizedValue = new type(initialValue);
                    } else {
                        throw new TypeError(`${initialValue} wasn't normalized with a correct type. Please check if ${type} is a valid type.`);
                    }
            }
        } catch (err) {
            console.error(err);
            normalizedValue = initialValue;
        } finally {
	        return m.prop(normalizedValue);
        }
    }

    //////////////////////
    // INSTANCE METHODS //
    //////////////////////

    /**
     * Creates a plain object from instance of model.
     * @return {object} plain object
     */
    serialize() {
        const obj = {};
        for( let field in this ) {

            // skip privates
            if(field.charAt(0) === '_') continue;

            if( typeof this[field] === 'function') {
                obj[field] = this[field]();
            } else {
                obj[field] = this[field];
            }
        }

        return obj;
    }

    // Return loading status of instance
    get isLoading() {
        return () => this._isLoading();
    }

    // Sets loading status of instance
    set isLoading(status) {
        status => this._isLoading(status);
    }

    /**
     * Retrieve data for specific item based on ID
     * @param  {int} id     item ID
     * @return {Promise}
     */
    get(id) {
        console.log('Get called:', this._type().url, id);
    }

    /**
     * Based on existence of item ID switches between PATCH or POST methods
     * @return {Promise}
     */
    save() {
        return this[this._uniqueIdentifier()]()
            ? this.patch(this._type().url)
            : this.post(this._type().url);
    }

    /**
     * Post request with instance data
     * @return {Promise}
     */
    post() {
        console.log('Post called:', this._type().url, this.serialize());
    }

    /**
     * Patch request with instance data
     * @param  {string} url relative endpoint for resource
     * @return {Promise}
     */
    patch() {
        console.log('Patch called:', this._type().url, this.serialize());
    }

    /**
     * Delete an item using its current id;
     * @return {Promise}
     */
    remove() {
        if (!this[this._uniqueIdentifier()]) {
            throw new Error('Can\'t remove item without an ID');
        }
        console.log('Delete called:', this._type().url, this[this._uniqueIdentifier()]);
    }
}

export default BaseModel;
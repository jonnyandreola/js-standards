import m from 'mithril';

class BaseModel {

	constructor (args) {
		this._isLoading = m.prop(false);
		this._uniqueIdentifier = m.prop(args.uniqueIdentifier);
	}

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
		return this._isLoading();
	}

	set isLoading(status) {
		return this._isLoading(status);
	}

	/////////////
	// METHODS //
	/////////////

	/**
	 * Fetch items for a given resource
	 * @param  {string} url  relative endpoint for resource
	 * @param  {object} args query params
	 * @return {Promise}
	 */
	static list(url, args) {
		console.log('Query called:', url, args);
	}

	list (url, args) {
		return BaseModel.list(url, args)
	}

	/**
	 * Retrieve data for specific item based on ID
	 * @param  {string} url relative endpoint for resource
	 * @param  {int} id  	item ID
	 * @return {Promise}
	 */
	get(url, id) {
		console.log('Get called:', url, id);
	}

	/**
	 * Based on existence of item ID switches between PATCH or POST methods
	 * @param  {string} url relative endpoint for resource
	 * @return {Promise}
	 */
	save(url) {
		return this[this._uniqueIdentifier()]() ? this.patch(url) : this.post(url);
	}

	/**
	 * Post request with instance data
	 * @param  {string} url relative endpoint for resource
	 * @return {Promise}
	 */
	post(url) {
		console.log('Post called:', url, this.serialize());
	}

	/**
	 * Patch request with instance data
	 * @param  {string} url relative endpoint for resource
	 * @return {Promise}
	 */
	patch(url) {
		console.log('Patch called:', url, this.serialize());
	}

	/**
	 * Delete an item based on ID
	 * @param  {string} url relative endpoint for resource
	 * @param  {int} id     item ID
	 * @return {Promise}
	 */
	remove(url, id) {
		console.log('Delete called:', url, id);
	}
}

export default BaseModel;
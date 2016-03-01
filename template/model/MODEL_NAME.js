import m from 'mithril';
import BaseModel from './Base';

class /*MODEL_NAME*/ extends BaseModel {

	constructor (args = {}) {
		super({
			_uniqueIdentifier: /*MODEL_NAME*/.uniqueIdentifier,
			_type: /*MODEL_NAME*/
		});
		this./*MODEL_NAME*/ID = super.setValue(args./*MODEL_NAME*/ID, 0);
	}

	////////////////////
	// STATIC METHODS //
	////////////////////

	/**
	 * Model resource endpoint
	 * @return {string} api endpoint for model resource
	 */
	static get url() {
		return '/api//*MODEL_NAME*/';
	}

	/**
	 * Label to get an item name
	 * @return {string}
	 */
	static get label() {
		return 'Name';
	}

	/**
	 * Return the unique identifier for item
	 * @return {string} ID for model item
	 */
	static get uniqueIdentifier() {
		return '/*MODEL_NAME*/ID';
	}

	/**
	 * Static method load list of models
	 * @param  {object} args Query object to get items
	 * @return {Promise}
	 */
	static list(args) {
		return super.list(args);
	}
}

export default /*MODEL_NAME*/;
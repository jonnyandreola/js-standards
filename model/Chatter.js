import m from 'mithril';
import BaseModel from './Base';

class Chatter extends BaseModel {

	constructor (args = {}) {
		super({
			_uniqueIdentifier: Chatter.uniqueIdentifier,
			_type: Chatter
		});
		this.ChatterID = BaseModel.setValue(args.ChatterID, 'int', 0);
		this.Content = BaseModel.setValue(args.Content, 'string', '');
		this.Name = BaseModel.setValue(args.CreatedByFullName, 'string', '');
	}

	////////////////////
	// STATIC METHODS //
	////////////////////

	/**
	 * Model resource endpoint
	 * @return {string} api endpoint for model resource
	 */
	static get url() {
		return '/api/Chatter';
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
		return 'ChatterID';
	}

	/**
	 * Static method load list of models
	 * @param  {object} args Query object to get items
	 * @return {Promise}
	 */
	static list(args) {
		return super.list(Chatter, args);
	}
}

export default Chatter;
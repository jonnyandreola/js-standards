import m from 'mithril';
import BaseModel from './Base';

class User extends BaseModel {

	constructor (args = {}) {
		super({
			_uniqueIdentifier: User.uniqueIdentifier,
			_type: User
		});
		this.UserID = BaseModel.setValue(args.UserID, 'int', 0);
		this.Name = BaseModel.setValue(args.Name, 'string', '');
		this.ReportsTo = BaseModel.setValue(args.ReportsTo, User, {});
		this.Position = BaseModel.setValue(args.Position, 'string', 'Web');
	}

	////////////////////
	// STATIC METHODS //
	////////////////////

	/**
	 * Model resource endpoint
	 * @return {string} api endpoint for model resource
	 */
	static get url() {
		return '/api/User.json';
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
		return 'UserID';
	}

	/**
	 * Static method load list of models
	 * @param  {object} args Query object to get items
	 * @return {Promise}
	 */
	static list(args) {
		return super.list(User, args);
	}
}

export default User;
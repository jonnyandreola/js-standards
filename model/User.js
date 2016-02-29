import m from 'mithril';
import BaseModel from './Base';

class User extends BaseModel {

	constructor (args) {
		super({uniqueIdentifier: 'UserID'});
		this.UserID = m.prop(args.UserID || 0)
		this.name = m.prop(args.name || '');
	}

	static get url() {
		return '/api/user';
	}

	static get label() {
		return 'Name';
	}

	static list(args) {
		super.list(User.url, args);
	}

	get(id) {
		super.get(User.url, id);
	}

	save() {
		super.save(User.url);
	}

	remove(id) {
		super.remove(User.url, id);
	}

}

export default User;
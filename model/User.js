import m from 'mithril';
import BaseModel from './Base';

class User extends BaseModel {
	constructor (args) {
		super({uniqueIdentifier: 'UserID'});
		this.UserID = m.prop(args.UserID || 0)
		this.name = m.prop(args.name || '');
	};

	static get url(){
		return '/api/users';
	}

	static list(args) {
		BaseModel.list(User.url, args);
	}

}

export default User;
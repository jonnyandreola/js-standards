import m from 'mithril';
import BaseModel from './Base';

class User extends BaseModel {
	constructor (args) {
		super({uniqueIdentifier: 'UserID'});
		this.UserID = m.prop(args.UserID || 0)
		this.name = m.prop(args.name || '');
	};

	get url(){
		return '/api/users';
	}
}

export default User;
import m from 'mithril';
import BaseModel from './Base';

class User extends BaseModel {
	constructor (args) {
		super(args);

		this.name = m.prop(args.name || '');
	}
}

export default User;
import User from '../../model/User';

export default function homePageController () {

	const ctrl = {};

	ctrl.user = new User({name: 'John Doe'});

	return ctrl;
}
import User from '../../model/User';

export default function homePageController () {
	/**
	 * Naming this 'ctrl' make easier to copy and paste
	 * between controller and view
	 */
	const ctrl = {};

	ctrl.user = new User({name: 'John Doe'});

	return ctrl;
}
import User from '../../model/User';

export default function homePageController () {
	/**
	 * Naming this 'ctrl' make easier to copy and paste
	 * between controller and view
	 */
	const ctrl = {};

	ctrl.user = new User({name: 'John Doe'});

	ctrl.user.list({Name: 'Jonny'});
	ctrl.user.get(1);
	ctrl.user.post();
	ctrl.user.patch();
	ctrl.user.remove(1);

	return ctrl;
}
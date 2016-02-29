import User from '../../model/User';
import BaseModel from '../../model/Base';

function homePageController () {
	/**
	 * Naming this 'ctrl' make easier to copy and paste
	 * between controller and view
	 */
	const ctrl = {};

	ctrl.user = new User();

	ctrl.user.name('Jonny');

	ctrl.user.get(1)
		.then(ctrl.user.isLoading = true);
	ctrl.user.save();
	ctrl.user.remove(1);

	User.list({Status: 'active'})
	User.remove(1)

	var users = User.list();
	var people = Collection(users);

	people.where('status', 'active');

	return ctrl;
}
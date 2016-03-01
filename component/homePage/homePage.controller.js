import m from 'mithril';
import User from '../../model/User';
import Collection from '../../model/Collection';

export default function homePageController () {
	const ctrl = {};

	ctrl.isLoading = m.prop(false);

    const response = [
        {UserID: 1, name: 'John'},
        {UserID: 2, name: 'Bruce'},
        {UserID: 3, name: 'Steve'}
    ];

    ctrl.People = new Collection(User, response);

	ctrl.init = function init(options) {
		/**
		 * Init all components controller here
		 */
	};

	return ctrl;
}
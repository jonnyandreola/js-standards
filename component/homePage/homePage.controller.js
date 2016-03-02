import m from 'mithril';
import Chatter from '../../model/Chatter';
import Collection from '../../model/Collection';

export default function homePageController () {
	const ctrl = {};

	ctrl.isLoading = m.prop(false);

    Chatter.list().then( posts => ctrl.Posts = Collection(Chatter, posts));
    debugger;
    // User.list({});

    // const response = [ {UserID: 1, name: 'John'}, {UserID: 2, name: 'Bruce'}, {UserID: 3, name: 'Steve'} ];

    // ctrl.People = new Collection(User, response);

    // ctrl.Jonny = ctrl.People.findByID(1);
    // ctrl.People.removeByID(2);

	ctrl.init = function init(options) {
		/**
		 * Init all components controller here
		 */
	};

	return ctrl;
}
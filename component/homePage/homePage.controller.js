import m from 'mithril';
import Chatter from '../../model/Chatter';
import Collection from '../../model/Collection';

export default function homePageController () {
	const ctrl = {};

	ctrl.isLoading = m.prop(true);

	ctrl.searchByID = id => {
		ctrl.result = ctrl.Posts.findByID(id);
	};

	ctrl.removeByID = id => {
		ctrl.Posts.removeByID(id);
	};

	Chatter.list()
		.then(data => ctrl.Posts = new Collection(data, Chatter))
		.then(() => ctrl.isLoading(false));


	ctrl.init = function init(options) {
		/**
		 * Init all components controller here
		 */
	};

	return ctrl;
}
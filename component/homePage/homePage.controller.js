import m from 'mithril';
import Chatter from '../../model/Chatter';
import Collection from '../../model/Collection';

export default function homePageController () {
	const ctrl = {};

	ctrl.isLoading = m.prop(false);

    ctrl.Posts = new Collection([], Chatter);

    Chatter.list().then(data => ctrl.Posts = new Collection(data, Chatter));

	ctrl.init = function init(options) {
		/**
		 * Init all components controller here
		 */
	};

	return ctrl;
}
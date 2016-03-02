import m from 'mithril';

export default function userPageController () {
	const ctrl = {};

	ctrl.isLoading = m.prop(false);

	ctrl.init = function init(options) {
		/**
		 * Init all components controller here
		 */
	};

	return ctrl;
}
import m from 'mithril';

export default function homePageView (ctrl) {
	return m('.page-container', [
		m('h1', 'Home Page'),
		m('p', ctrl.user.name()),
		m('small', (ctrl.user.isLoading() ? 'Loading' : 'Not loading') ),
		m('button', {
			onclick: ctrl.user.toggleLoading.bind(ctrl.user)
		},'Toggle')
	])
}
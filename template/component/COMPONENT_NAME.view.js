import m from 'mithril';


export default function /*COMPONENT_NAME*/View (ctrl) {
	return m('.page-container', [
        m('h1', 'Home Page'),
        m('p', ctrl.user.name()),
        m('small', (ctrl.user.isLoading ? 'Loading' : 'Not loading') ),
        m('button', {
            onclick: ctrl.user.save.bind(ctrl.user)
        },'Save')
	])
}
import m from 'mithril';


export default function homePageView (ctrl) {
	return m('.homePage-container', [
        m('ul', [
            ctrl.People.map((user) => {
                return m('li', {
                    key: user.UserID
                }, user.name())
            })
        ]),
        m('h2', ctrl.Jonny.name())
	])
}
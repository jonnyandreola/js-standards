import m from 'mithril';


export default function homePageView (ctrl) {
    if (!ctrl.Posts) return;
	return m('.homePage-container', [
        m('ul', [
            ctrl.Posts.map((post) => {
                return m('li', { key: post.ChatterID() }, post.Content(), post.Name())
            })
        ])
	])
}
import m from 'mithril';


export default function homePageView (ctrl) {
    'use strict';

    if (ctrl.isLoading()) return;
    return m('.homePage-container', [
        m('input', {
            placeholder: 'Search post by ID',
            oninput: m.withAttr('value', ctrl.searchByID)
        }),
        ctrl.result && m('.post', [
            m('b', ctrl.result.User().Name()),
            m('p', ctrl.result.Content())
        ]),
        m('ul', [
            ctrl.Posts.map((post) => {
                return m('li', {
                    key: post.ChatterID()
                }, [
                    m('b', post.User().Name() + ' ' + post.User().Position()),
                    m('p', post.Content()),
                    m('button', {
                        onclick: ctrl.removeByID.bind(post, post.ChatterID())
                    }, 'Remove')
                ]);
            })
        ])
    ]);
}
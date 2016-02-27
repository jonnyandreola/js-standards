import m from 'mithril';
import homePage from './component/homePage/homePage';

const APPLICATION_CONTAINER = document.body;

m.route( APPLICATION_CONTAINER, '/', {
	'/': homePage
});
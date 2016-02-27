import m from 'mithril';

class BaseModel {
	constructor (args) {
		this.isLoading = m.prop(false);
	}

	toggleLoading () {
		this.isLoading(!this.isLoading())
	}
}

export default BaseModel;
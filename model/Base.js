import m from 'mithril';

class BaseModel {
	constructor () {
		this.isLoading = m.prop(false);
	}

	toObject() {
		const obj = {};
		for(let field in this) {
			obj[field] = this[field]();
		}

		return obj;
	}

	static list(args) {
		console.log('Query called:', this.url, args);
	}

	list(args) {
		BaseModel.list(args);
	}

	get(id) {
		console.log('Get called:', this.url, id);
	}

	save() {
		return this.id() ? this.patch() : this.post();
	}

	post() {
		console.log('Post called:', this.url, this.toObject());
	}

	patch() {
		console.log('Patch called:', this.url, this.toObject());
	}

	remove(id) {
		console.log('Post called:', this.url, id);
	}
}

export default BaseModel;
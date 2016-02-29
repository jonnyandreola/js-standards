import m from 'mithril';

class BaseModel {
	constructor ({uniqueIdentifier = 'id'}) {
		this._isLoading = m.prop(false);
		this._uniqueIdentifier = m.prop(uniqueIdentifier);
	}

	toObject() {
		const obj = {};
		for(let field in this) {
			if(field.charAt(0) === '_') continue; // no privates
			obj[field] = this[field]();
		}

		return obj;
	}

	get isLoading() {
		return this._isLoading();
	}

	static list(url, args) {
		console.log('Query called:', url, args);
	}

	get(id) {
		console.log('Get called:', this.url, id);
	}

	save() {
		return this[this._uniqueIdentifier()]() ? this.patch() : this.post();
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
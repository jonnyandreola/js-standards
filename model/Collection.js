class Collection {
    constructor(type, items) {
        this.Items = items.map((item) => type(item));
    }

    where(prop, value) {
        return this.Items.filter( item => item[prop] === value );
    }
}
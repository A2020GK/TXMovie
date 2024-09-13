function cloneObject(obj) {
    if (obj instanceof HTMLElement) return null;
    let clone = Object.create(obj);
    for (let key in clone) {
        if (typeof clone[key] === 'object') {
            clone[key] = cloneObject(clone[key]);
        }
    }
    return clone;

}

export { cloneObject};
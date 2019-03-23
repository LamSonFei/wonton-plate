import { BehaviorSubject } from "rxjs";
import set from 'lodash/set';
import get from 'lodash/get';

/**
 * Simple store that only lives in the SPA current page.
 * All data is lost when the page is closed / refreshed or when the user launches the application in another tab.
 * This store can be useful to implement a transaction tracker for instance, forbidding a change of page / context.
 */
export class SimpleStore extends BehaviorSubject {
    /**
     * Gets a session store based on its ID.
     * @param {String} name the store name
     */
    static get(name) {
        SimpleStore.registry = SimpleStore.registry || {};
        SimpleStore.registry[name] = SimpleStore.registry[name] || new SimpleStore();
        return SimpleStore.registry[name];
    }
    /**
     * Constructor.
     */
    constructor() {
        super();
        this._data = {};
        this.next(this._data);
    }
    /**
     * Gets the stored data.
     * @param {String} path optional path to the data to get
     * @return the queried data
     */
    getData(path) {
        if (typeof path === 'string') {
            return get(this._data, path);
        } else {
            return this._data;
        }
    }
    /**
     * Sets data in the store.
     * @param {Object} data the data to store
     * @param {String} path optional path to the data to set
     */
    setData(data, path) {
        if (typeof path === 'string') {
            set(this._data, path, data);
        } else {
            this._data = data;
        }
        this.next(this._data);
    }
}
export default SimpleStore;
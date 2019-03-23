import set from 'lodash/set';
import get from 'lodash/get';
import { BehaviorSubject } from "rxjs";

/**
 * Store that interacts with the browser's local storage.
 * Data lives in the browser until the user clears them out manually or the code deletes it explicitely.
 * This store proposes a time-to-live option for the stored data but the application needs to run to clean the outdated data.
 * It could be useful to implement some local user preferences or a shopping cart system.
 */
export class LocalStorageStore extends BehaviorSubject {
    /**
     * @return the browser storage type
     */
    static get _STORAGE_TYPE() {
        return 'localStorage';
    }
    /**
     * Gets a local storage based store based on its ID.
     * @param {String} name the store name
     */
    static get(name) {
        LocalStorageStore.registry = LocalStorageStore.registry || {};
        LocalStorageStore.registry[name] = LocalStorageStore.registry[name] || new LocalStorageStore(name);
        return LocalStorageStore.registry[name];
    }
    /**
     * Constructor.
     * @param {String} name the store's name
     */
    constructor(name) {
        if (!name) throw new Error('Store name is required');
        super();
        this._name = name;
        this._storage = window[this.constructor._STORAGE_TYPE];
        this.applyTimeToLive();
        const stored = this._storage.getItem(this._name);
        this.next(stored ? JSON.parse(stored) : {});
    }
    /**
     * Applies the specified time-to-live for this store if any.
     */
    applyTimeToLive() {
        // Time-to-live update
        let ttl = this._storage.getItem(`${this._name}--ttl`);
        if (!ttl) {
            ttl = -1;
            this._storage.setItem(`${this._name}--ttl`, ttl);
        }
        // Time-to-live application
        if (ttl >= 0) {
            const now = Date.now();
            const lastSave = window.localStorage.getItem(`${this._name}--ts`) || Date.now();
            if (now - this._timeToLive > lastSave) {
                this._storage.removeItem(this._name);
                this._storage.removeItem(`${this._name}--ts`);
            }
        }
    }
    /**
     * Sets a new time-to-live for the stored data.
     * @param {Number} ttl the data time-to-live
     */
    setTimeToLive(ttl) {
        this._storage.setItem(`${this._name}--ttl`, ttl);
    }
    /**
     * Gets the stored data.
     * @param {String} path optional path to the data to get
     * @return the queried data
     */
    getData(path) {
        this.applyTimeToLive();
        let data = this._storage.getItem(this._name);
        data = data ? JSON.parse(data) : {};
        if (typeof path === 'string') {
            return get(data, path);
        } else {
            return data;
        }
    }
    /**
     * Sets data in the store.
     * @param {Object} data the data to store
     * @param {String} path optional path to the data to set
     */
    setData(data, path) {
        let storedData = JSON.parse(this._storage.getItem(this._name));
        if (typeof path === 'string') {
            set(storedData, path, data);
        } else {
            storedData = data;
        }
        this._storage.setItem(this._name, JSON.stringify(storedData));
        this._storage.setItem(`${this._name}--ts`, Date.now());
        this.next(storedData);
    }
}
export default LocalStorageStore;
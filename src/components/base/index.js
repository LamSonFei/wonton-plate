'use strict';

/**
 * Base component for the application.
 * Provides support for adding/removing events on connection/disconnection.
 */
export class BaseComponent extends HTMLElement {
    /**
     * Constructor.
     * 
     * @param {object} props the initial properties of the component
     */
    constructor(props) {
        super();
        this._props = props || {};
        const _this = this;
        const initData = typeof _this.initData === 'function' ? _this.initData() : null;
        if (!initData) {
            console.error('Missing initData function on component.');
            return;
        }
        _this.classList.add('cmp-base');
        if (initData.componentName) _this.classList.add(initData.componentName);
        _this._componentName = initData.componentName || 'some-cmp';
        // View template init
        _this.innerHTML = typeof initData.template === 'function' ? initData.template() : '';
        // References init
        _this._refs = {};
        (Object.getOwnPropertyNames(initData.references) || []).map(refName => _this._refs[refName] = _this.querySelector(initData.references[refName]));
        // Listeners registration
        _this._listeners = initData.listeners || {};
        // Methods bindings
        Object.getOwnPropertyNames(_this)
            .filter(p => typeof _this[p] === 'function')
            .map(fn => _this[fn].bind(_this));
    }
    // Utilities
    /**
     * Gets a reference to a child element from its name.
     * @param {string} refName the name of the reference
     * @returns the HTML element matching the name or undefined if none is found
     */
    getRef(refName) {
        return this._refs[refName];
    }
    /**
     * Gets the properties passed as a parameter to the constructor of the class.
     * @returns the properties of the component
     */
    get props() {
        return this._props;
    }
    // Lifecycle management
    connectedCallback() {
        console.log(`Adding listeners to ${this._componentName}!`);
        for (const compRef in this._listeners) {
            const compListeners = this._listeners[compRef];
            for (const event in compListeners) {
                (compRef !== 'this' ? this.getRef(compRef) : this).addEventListener(event, compListeners[event]);
            }
        }
    }
    disconnectedCallback() {
        console.log(`Removing listeners from ${this._componentName}!`);
        for (const compRef in this._listeners) {
            const compListeners = this._listeners[compRef];
            for (const event in compListeners) {
                (compRef !== 'this' ? this.getRef(compRef) : this).removeEventListener(event, compListeners[event]);
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Updated ${name} from ${oldValue} to ${newValue} on ${this._componentName}!`);
    }
}
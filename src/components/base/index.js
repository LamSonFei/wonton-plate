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
        _this.classList.add('cmp-base');
        _this._componentName = 'some-cmp';
        if (typeof _this.componentName === 'function') {
            _this.classList.add(_this.componentName());
            _this._componentName = _this.componentName() || 'some-cmp';
        }
        // View template init
        _this.innerHTML = typeof _this.template === 'function' ? _this.template(props) : '';
        // References init
        _this._refs = {};
        if (typeof _this.references === 'function') {
            const references = _this.references();
            (Object.getOwnPropertyNames(references) || []).map(refName => _this._refs[refName] = _this.querySelector(references[refName]));
        }
        // Listeners registration
        _this._listeners = {};
        if (typeof _this.listeners === 'function') {
            _this._listeners = _this.listeners() || {};
        }
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
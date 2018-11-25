'use strict';

import log from 'services/log';

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
        this.classList.add('cmp-base');
        // Properties init
        this._props = props || {};
        // Component name is used for logging and styling
        this._componentName = 'some-cmp';
        if (typeof this.componentName === 'function') {
            this.classList.add(this.componentName());
            this._componentName = this.componentName() || 'some-cmp';
        }
        // Tracker to know when to use listeners, getRef...
        this._rendered = false;
        // Methods bindings
        Object.getOwnPropertyNames(this)
            .filter(p => typeof this[p] === 'function')
            .map(fn => this[fn].bind(this));
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
    /**
     * Tests if this component is actually rendered and ready to use (templates, references, listeners).
     * @returns true if it is initialized, false otherwise
     */
    get isRendered() {
        return this._rendered;
    }
    // Lifecycle management
    connectedCallback() {
        // View template init
        this.innerHTML = typeof this.template === 'function' ? this.template(this._props) : '';
        // References init
        this._refs = {};
        if (typeof this.references === 'function') {
            const references = this.references();
            (Object.getOwnPropertyNames(references) || []).forEach(refName => this._refs[refName] = this.querySelector(references[refName]));
        }
        // Listeners registration
        this._listeners = {};
        if (typeof this.listeners === 'function') {
            this._listeners = this.listeners() || {};
        }
        log.debug(`Adding listeners to ${this._componentName}!`);
        Object.getOwnPropertyNames(this._listeners).forEach(compRef => {
            const compListeners = this._listeners[compRef];
            Object.getOwnPropertyNames(compListeners).forEach(event => {
                (compRef !== 'this' ? this.getRef(compRef) : this).addEventListener(event, compListeners[event]);
            });
        });
        this._initialized = true;
    }
    disconnectedCallback() {
        log.debug(`Removing listeners from ${this._componentName}!`);
        Object.getOwnPropertyNames(this._listeners).forEach(compRef => {
            const compListeners = this._listeners[compRef];
            Object.getOwnPropertyNames(compListeners).forEach(event => {
                (compRef !== 'this' ? this.getRef(compRef) : this).removeEventListener(event, compListeners[event]);
            });
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        log.debug(`Updated ${name} from ${oldValue} to ${newValue} on ${this._componentName}!`);
    }
}
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
    constructor(props = {}) {
        super();
        // Properties init
        this._props = props || {};
        // Component name is used for logging and styling
        this._componentName = 'some-cmp';
        if (typeof this.componentName === 'function') {
            this._componentName = this.componentName() || 'some-cmp';
        }
        // Properties/attributes definition
        this._initPropertiesAttributes();
        // Tracker to know when to use listeners, getRef...
        this._rendered = false;
        // Methods bindings
        this._initClassMethodsBinding();
        // Init shadow if needed
        if (this.useShadowDOM()) {
            // View template init
            this._injectTemplate();
            // References init
            this._initReferences();
        }
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
    /**
     * Override to return true to use Shadow DOM inside the custom element.
     */
    useShadowDOM() {
        return false;
    }
    // Lifecycle management
    connectedCallback() {
        // Class information
        this.classList.add('cmp-base');
        this.classList.add(this.componentName());
        if (!this.useShadowDOM()) {
            // View template init
            this._injectTemplate();
            // References init
            this._initReferences();
        }
        // Listeners registration
        this._initListeners();
    }
    disconnectedCallback() {
        this._cleanListeners();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        log.debug(`Updated ${name} from ${oldValue} to ${newValue} on ${this._componentName}!`);
    }

    // Internal implementation
    _initPropertiesAttributes() {
        if (typeof this.propertiesAttributes === 'function') {
            const propertiesAttributes = this.propertiesAttributes();
            if (propertiesAttributes && propertiesAttributes.length) {
                propertiesAttributes.forEach(property => {
                    Object.defineProperty(this, property, {
                        set: function(value) {
                            this.setAttribute(property, value);
                        },
                        get: function() {
                            return this.getAttribute(property);
                        }
                    });
                });
            }
        }
    }
    _initClassMethodsBinding() {
        Object.getOwnPropertyNames(this)
            .filter(p => typeof this[p] === 'function')
            .map(fn => this[fn].bind(this));
    }

    _injectTemplate() {
        const html = typeof this.template === 'function' ? this.template(this._props) : '';
        if (this.useShadowDOM()) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = html;
        } else {
            this.innerHTML = html;
        }
        // Update the rendered state
        this._rendered = true;
    }

    _initReferences() {
        this._refs = {};
        if (typeof this.references === 'function') {
            const references = this.references();
            (Object.getOwnPropertyNames(references) || []).forEach(refName => this._refs[refName] = (this.useShadowDOM() ? this.shadowRoot : this).querySelector(references[refName]));
        }
    }

    _initListeners() {
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
    }

    _cleanListeners() {
        log.debug(`Removing listeners from ${this._componentName}!`);
        Object.getOwnPropertyNames(this._listeners).forEach(compRef => {
            const compListeners = this._listeners[compRef];
            Object.getOwnPropertyNames(compListeners).forEach(event => {
                (compRef !== 'this' ? this.getRef(compRef) : this).removeEventListener(event, compListeners[event]);
            });
        });
    }
}
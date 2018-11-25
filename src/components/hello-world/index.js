'use strict';

import template from './template.html';

import log from 'services/log';
import { BaseComponent } from "components/base";

/**
 * Hello World demo component.
 */
export class HelloWorld extends BaseComponent {
    // Init
    constructor() {
        super();
    }
    componentName() {
        return 'cmp-hello-world';
    }
    template() {
        return template;
    }
    references() {
        return {
            'helloWorldButton': '.cmp-hello-world_button'
        }
    }
    listeners() {
        return {
            'this': {
                'click': () => log.info('HelloWorld got clicked as a component!')
            },
            'helloWorldButton': {
                'click': () => this.sayHello()
            }
        }
    }
    // Properties
    get name() {
        return this.getAttribute('name');
    }
    set name(name) {
        this.setAttribute('name', name);
    }
    // Methods
    sayHello() {
        alert(`Hello ${this.name || 'World'}!`);
    }
    // Observed attributes
    static get observedAttributes() {
        return ['name'];
    }
    connectedCallback() {
        super.connectedCallback();
        this.getRef('helloWorldButton').innerText = `Hello ${this.name || 'World'}!`;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered) return;
        switch (name) {
            case 'name':
                this.getRef('helloWorldButton').innerText = `Hello ${this.name || 'World'}!`;
                break;
            default:
        }
    }
}

customElements.define('hello-world', HelloWorld);
'use strict';

import { BaseComponent } from "../base/index.js";

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
        return `<button type="button" class="cmp-hello-world_button">Hello World!</button>`;
    }
    references() {
        return {
            'helloWorldButton': '.cmp-hello-world_button'
        }
    }
    listeners() {
        return {
            'this': {
                'click': () => console.log('HelloWorld got clicked as a component!')
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
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'name':
                this.getRef('helloWorldButton').innerText = `Hello ${this.name || 'World'}!`;
                break;
            default:
        }
    }
}

customElements.define('hello-world', HelloWorld);
'use strict';

import { BaseComponent } from "../base/index.js";

/**
 * Hello World demo component.
 */
export class HelloWorld extends BaseComponent {
    // Init
    constructor() {
        super();
    };
    // Initialization data
    initData() {
        return {
            componentName: 'cmp-hello-world',
            template: () =>  `<button type="button" class="cmp-hello-world_button">Hello ${this.name || 'World'}!</button>`,
            references: {
                'helloWorldButton': '.cmp-hello-world_button'
            },
            listeners: {
                'this': {
                    'click': () => console.log('HelloWorld got clicked as a component!')
                },
                'helloWorldButton': {
                    'click': () => this.sayHello()
                }
            }
        }
    }
    // Observed attributes
    static get observedAttributes() {
        return ['name'];
    }
    // Properties
    get name() {
        return this.getAttribute('name');
    }
    set name(name) {
        this.setAttribute('name', name);
        this.fromRef('helloWorldButton').innerText = `Hello ${this.name || 'World'}!`;
    }
    // Methods
    sayHello() {
        alert(`Hello ${this.name}!`);
    }
}

customElements.define('hello-world', HelloWorld);
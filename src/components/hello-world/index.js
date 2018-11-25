'use strict';

import template from './template.html';

import log from 'services/log';
import { BaseComponent } from "components/base";
import i18n from 'services/i18n';

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
    get helloWorldMessage() {
        return i18n.t('cmp.hello-world.hello', {name: this.name || i18n.t('cmp.hello-world.world')});
    }
    // Methods
    sayHello() {
        alert(this.helloWorldMessage);
    }
    refreshInnerTexts() {
        this.getRef('helloWorldButton').innerText = this.helloWorldMessage;
    }
    // Observed attributes
    static get observedAttributes() {
        return ['name'];
    }
    localeChangedCallback() {
        this.refreshInnerTexts();
    }
    connectedCallback() {
        super.connectedCallback();
        this._i18nSubscription = i18n.subscribe(this);
        this.refreshInnerTexts();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered || oldValue === newValue) return;
        switch (name) {
            case 'name':
                this.refreshInnerTexts();
                break;
            default:
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._i18nSubscription.unsubscribe();
    }
}

customElements.define('hello-world', HelloWorld);
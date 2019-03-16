'use strict';

import './styles.css';
import template from './template.html';

import log from 'services/log';
import { BaseComponent } from "components/base";
import { I18nComponent } from 'components/mixins/i18n';
import { mix } from 'utils/mixins';


/**
 * Hello World demo component.
 */
export class HelloWorld extends mix(BaseComponent).with(I18nComponent) {
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
    // Methods
    sayHello() {
        this.dispatchEvent(new CustomEvent('hello', { 
            bubbles: true, 
            detail: {
                name: this.name
            }
        }));
    }
    refreshInnerTexts() {
        this.getRef('helloWorldButton').innerText = this.helloWorldMessage;
    }
    // Computed properties
    get helloWorldMessage() {
        return this.i18n('cmp.hello-world.hello', {name: this.name || this.i18n('cmp.hello-world.world')});
    }
    // Properties attributes
    propertiesAttributes() {
        return ['name'];
    }
    // Observed attributes
    static get observedAttributes() {
        return ['name'];
    }
    // i18n
    i18nFilesPath() {
        return 'components/hello-world/i18n';
    }
    // Listeners
    localeChangedCallback() {
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
}

customElements.define('hello-world', HelloWorld);
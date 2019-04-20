'use strict';

import './styles.css';
import template from './template.html';

import log from 'services/log';
import { WontonMixin } from 'components/mixins/wonton';
import { I18nMixin } from 'components/mixins/i18n';
import { mix } from 'utils/mixins';


/**
 * Hello World demo component.
 */
export class HelloWorld extends mix(HTMLElement).with(WontonMixin, I18nMixin) {
    // Wonton config
    static componentName() {
        return 'hello-world';
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
    propertiesAttributes() {
        return ['name'];
    }
    // I18n config
    i18nFilesPath() {
        return 'components/hello-world/i18n';
    }
    localeChangedCallback() {
        this.refreshInnerTexts();
    }
    // Custom properties
    get helloWorldMessage() {
        return this.i18n('cmp.hello-world.hello', {name: this.name || this.i18n('cmp.hello-world.world')});
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
    // Lifecycle
    static get observedAttributes() {
        return ['name'];
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

customElements.define(HelloWorld.componentName(), HelloWorld);
export default HelloWorld;
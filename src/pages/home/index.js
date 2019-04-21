'use strict';

import I18nMixin from 'components/mixins/i18n';
import { mix } from 'utils/mixins';

import './styles.css';
import template from './template.html';

import log from 'services/log';
import { BasePage } from 'pages/base';
import 'components/hello-world';
import 'components/modal-dialog';

/**
 * A page introducing the demo application template.
 * This page can be called with a custom "name" parameter to demo route variables handling
 * It also comes packaged with a simple Hello World button because it was just unavoidable, wasn't it?
 */
export class HomePage extends mix(BasePage).with(I18nMixin) {
    // Wonton config
    static componentName() {
        return 'page-home';
    }
    template() {
        return template;
    }
    references() {
        return {
            'helloWorldComponent': '.my-hello-world-component',
            'modalDialog': '.my-modal-dialog',
            'modalDialogTitle': '.hello-modal-title',
            'modalDialogBody': '.hello-modal-body',
            'message': '.welcome-message',
            'dragonCopyright': '.dragon-copyright'
        }
    }
    listeners() {
        return {
            'helloWorldComponent': {
                'hello': e => {
                    this.name = e.detail.name;
                    this.refreshModalLabels();
                    this.getRef('modalDialog').show();
                }
            }
        }
    }
    // I18n config
    i18nFilesPath() {
        return 'pages/home/i18n';
    }
    localeChangedCallback() {
        this.refreshModalLabels();
    }
    // Custom properties
    set helloName(userName) {
        this.getRef('helloWorldComponent').name = userName;
    }
    // Methods
    refreshModalLabels() {
        const name =  this.name || this.i18n('page.home.world');
        this.getRef('modalDialogTitle').innerText = this.i18n('page.home.hello', { name });
        this.getRef('modalDialogBody').innerText = this.i18n('page.home.greet', { name });
        this.getRef('message').innerHTML = this.i18n('page.home.message_html');
        this.getRef('dragonCopyright').innerHTML = this.i18n('page.home.dragonCopy_html');
    }
    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        setTimeout((() => {
            log.debug('Dispatching a click event on hello world component!')
            this.getRef('helloWorldComponent').dispatchEvent(new Event('click'));
        }).bind(this), 0)
    }
}

customElements.define('page-home', HomePage);
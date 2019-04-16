'use strict';

import I18nMixin from 'components/mixins/i18n';
import { mix } from 'utils/mixins';

import './styles.css';
import template from './template.html';

import log from 'services/log';
import { BasePage } from 'pages/base';
import 'components/hello-world';
import 'components/modal-dialog';

export class HomePage extends mix(BasePage).with(I18nMixin) {
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
            'modalDialogBody': '.hello-modal-body'
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
    // Properties
    set helloName(userName) {
        this.getRef('helloWorldComponent').name = userName;
    }
    refreshModalLabels() {
        const name =  this.name || this.i18n('page.home.world');
        this.getRef('modalDialogTitle').innerText = this.i18n('page.home.hello', { name });
        this.getRef('modalDialogBody').innerText = this.i18n('page.home.greet', { name });
    }
    // i18n
    i18nFilesPath() {
        return 'pages/home/i18n';
    }
    // Listeners
    connectedCallback() {
        super.connectedCallback();
        setTimeout((() => {
            log.debug('Dispatching a click event on hello world component!')
            this.getRef('helloWorldComponent').dispatchEvent(new Event('click'));
        }).bind(this), 0)
    }
    localeChangedCallback() {
        this.refreshModalLabels();
    }
}

customElements.define('page-home', HomePage);
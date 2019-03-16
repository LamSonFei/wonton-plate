'use strict';

import './styles.css';
import template from './template.html';

import log from 'services/log';
import { BasePage } from 'pages/base';
import 'components/hello-world';
import 'components/modal-dialog';

export class HomePage extends BasePage {
    constructor(props) {
        super(props);
    }
    componentName() {
        return 'page-home';
    }
    template(props) {
        return template.replace(/\[props\.userName\]/g, props.userName || 'World');
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
                    this.getRef('modalDialogTitle').innerText = `Hello ${e.detail.name || 'World'}!`
                    this.getRef('modalDialogBody').innerText = `How are you today, ${e.detail.name || 'World'}?`
                    this.getRef('modalDialog').open();
                }
            }
        }
    }
    set helloName(userName) {
        this.getRef('helloWorldComponent').name = userName;
    }
    connectedCallback() {
        super.connectedCallback();
        setTimeout((() => {
            log.debug('Dispatching a click event on hello world component!')
            this.getRef('helloWorldComponent').dispatchEvent(new Event('click'));
        }).bind(this), 0)
    }
}

customElements.define('page-home', HomePage);
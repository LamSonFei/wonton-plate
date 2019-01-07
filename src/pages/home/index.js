'use strict';

import template from './template.html';

import log from 'services/log';
import { BasePage } from 'pages/base';
import 'components/hello-world';

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
            'helloWorldComponent': '.my-hello-world-component'
        }
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
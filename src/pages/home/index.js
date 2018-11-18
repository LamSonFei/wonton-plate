'use strict';

import { BasePage } from '../base/index.js';
import { HelloWorld } from './../../components/hello-world/index.js';

export class HomePage extends BasePage {
    constructor(props) {
        super(props);
    }
    initData() {
        return {
            componentName: 'page-hello-world',
            template: () => `<hello-world class="my-hello-world-component" name="${this.props.userName}"></hello-world>`,
            references: {
                'helloWorldComponent': '.my-hello-world-component'
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        setTimeout((() => {
            console.log('Dispatching a click event on hello world component!')
            this.getRef('helloWorldComponent').dispatchEvent(new Event('click'));
        }).bind(this), 0)
    }
}

customElements.define('home-page', HomePage);
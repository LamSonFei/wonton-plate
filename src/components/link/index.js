'use strict';

import './styles.css';

import Router from 'services/router'
import { BaseComponent } from 'components/base';

export class Link extends BaseComponent {
    componentName() {
        return 'cmp-link';
    }
    template() {
        return `<button class="cmp-link-button" type="button">${this.label}</button>`;
    }
    references() {
        return {
            'link': '.cmp-link-button'
        };
    }
    listeners() {
        return {
            'link': {
                'click': () => {
                    Router.navigateTo(this.path);
                }
            }
        };
    }
    propertiesAttributes() {
        return ['label', 'path'];
    }
}

customElements.define('router-link', Link);
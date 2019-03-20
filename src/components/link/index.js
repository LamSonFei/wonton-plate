'use strict';

import './styles.css';

import Router from 'services/router'
import { BaseComponent } from 'components/base';

export class Link extends BaseComponent {
    componentName() {
        return 'cmp-link';
    }
    template() {
        return `<a class="cmp-link-button" href="${this.path}">${this.label}</a>`;
    }
    references() {
        return {
            'link': '.cmp-link-button'
        };
    }
    listeners() {
        return {
            'link': {
                'click': e => {
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        Router.navigateTo(this.path);
                    }
                }
            }
        };
    }
    propertiesAttributes() {
        return ['label', 'path'];
    }
}

customElements.define('router-link', Link);
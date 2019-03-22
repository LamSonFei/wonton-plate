'use strict';

import './styles.css';

import Router from 'services/router'
import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';

export class WontonLink extends mix(HTMLElement).with(WontonMixin) {
    static componentName() {
        return 'wtn-link';
    }
    template() {
        return `<a class="wtn-link-link" href="${this.path}">${this.label}</a>`;
    }
    references() {
        return {
            'link': '.wtn-link-link'
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

customElements.define(WontonLink.componentName(), WontonLink);
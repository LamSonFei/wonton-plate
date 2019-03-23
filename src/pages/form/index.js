'use strict';

import css from '!!raw-loader!./styles.css';
import template from './template.html';

import 'components/form';
import { BasePage } from 'pages/base';

export class FormPage extends BasePage {
    constructor() {
        super();
        const nationalitySelect = this.getRef('form').querySelector('[name="nationality"]');
        if (!nationalitySelect.children.length) {
            const options = [{ label: 'Singaporean', value: 'SG' }, { label: 'French', value: 'FR' }].reduce((opts, { label, value }) => {
                opts += `<option value='${value}'><span>${label}</span></option>`;
                return opts;
            }, '');
            nationalitySelect.insertAdjacentHTML('beforeend', options);
        }
    }
    useShadowDOM() {
        return true;
    }
    static componentName() {
        return 'page-form';
    }
    template() {
        return `<style>${css}</style>${template}`;
    }
    references() {
        return {
            'form': '.page-form-form'
        }
    }
    listeners() {
        return {
            'form': {
                'submit': e => {
                    e.preventDefault();
                    const form = this.getRef('form');
                    alert(JSON.stringify(form.getJsonData()));
                }
            }
        }
    }
}

customElements.define('page-form', FormPage);
'use strict';

import './styles.css';
import template from './template.html';

import 'components/form';
import { BasePage } from 'pages/base';

export class FormPage extends BasePage {
    static componentName() {
        return 'page-form';
    }
    template() {
        return template;
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
    connectedCallback() {
        super.connectedCallback();
        const nationalitySelect = this.getRef('form').querySelector('[name="nationality"]');
        if (!nationalitySelect.children.length) {
            const options = [{ label: 'Singaporean', value: 'SG' }, { label: 'French', value: 'FR' }].reduce((opts, { label, value }) => {
                opts += `<option value='${value}'><span>${label}</span></option>`;
                return opts;
            }, '');
            nationalitySelect.insertAdjacentHTML('beforeend', options);
        }
    }
}

customElements.define('page-form', FormPage);
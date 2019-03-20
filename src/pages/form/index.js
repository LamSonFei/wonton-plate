'use strict';

import './styles.css';
import template from './template.html';

import { BasePage } from 'pages/base';

export class FormPage extends BasePage {
    componentName() {
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
                    let formData = Array.from(form.querySelectorAll('input')).reduce((data, input) => {
                        let val;
                        switch (input.type) {
                            case 'date':
                                val = input.valueAsDate;
                                break;
                            case 'checkbox':
                                val = input.checked;
                                break;
                            case 'radio':
                                val = input.checked ? input.value : data[input.name];
                                break;
                            default:
                                val = input.value;
                        }
                        data[input.name] = val;
                        return data;
                    }, {});
                    formData = Array.from(form.querySelectorAll('select')).reduce((data, select) => {
                        data[select.name] = select.value;
                        return data;
                    }, formData);
                    alert(JSON.stringify(formData));
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
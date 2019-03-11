'use strict';

import template from './template.html';

import { BasePage } from 'pages/base';

export class FormPage extends BasePage {
    constructor(props) {
        super(props);
    }
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
                'submit': (e) => {
                    e.preventDefault();
                    const formData = Array.from(this.getRef('form').querySelectorAll('input')).reduce((data, input) => {
                        data[input.name] = input.value;
                        return data;
                    }, {});
                    alert(JSON.stringify(formData));
                }
            }
        }
    }
}

customElements.define('page-form', FormPage);
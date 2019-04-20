'use strict';

import css from '!!raw-loader!./styles.css';
import template from './template.html';

import 'components/form';
import { BasePage } from 'pages/base';
import LocalStorageStore from 'stores/localstorage-store';

/**
 * A page showcasing the use of an extended Form component.
 * The page also uses a local storage bound store to persist whatever data has been submitted.
 * As you can see, the amount of code to retrieve/inject data from/into the inputs is fairly straightforward.
 */
export class FormPage extends BasePage {
    // Constructor
    constructor() {
        super();
        // Init options
        const nationalitySelect = this.getRef('form').querySelector('[name="nationality"]');
        if (!nationalitySelect.children.length) {
            const options = [{ label: 'Singaporean', value: 'SG' }, { label: 'French', value: 'FR' }].reduce((opts, { label, value }) => {
                opts += `<option value='${value}'><span>${label}</span></option>`;
                return opts;
            }, '');
            nationalitySelect.insertAdjacentHTML('beforeend', options);
        }
    }
    // Wonton config
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
                    // Retrieve data
                    const form = this.getRef('form');
                    const jsonData = form.getJsonData();
                    this._store.setData(jsonData);
                    alert(JSON.stringify(jsonData));
                }
            }
        }
    }
    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        // Inject data
        this._store = LocalStorageStore.get('example-form');
        this.getRef('form').setJsonData(this._store.getData());
    }
}

customElements.define('page-form', FormPage);
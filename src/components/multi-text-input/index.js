'use strict';

import './styles.css';
import template from './template.html';

import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';


/**
 * Component handling a variable number of text inputs for array-typed fields.
 */
export class MultiTextInput extends mix(HTMLElement).with(WontonMixin) {
    get inputCount() {
        return this._inputCount || 0;
    }
    set inputCount(inputCount) {
        this._inputCount = inputCount;
    }
    static componentName() {
        return 'wtn-multi-text-input';
    }
    template() {
        return template;
    }
    references() {
        return {
            'container': '.wtn-multi-text-input-container',
            'addBtn': '.wtn-multi-text-input-add'
        };
    }
    listeners() {
        return {
            'addBtn': {
                'click': () => {
                    const inputNb = this.inputCount++;
                    this.getRef('addBtn').insertAdjacentHTML('beforebegin', `
                        <input type="text" class="wtn-multi-text-input-input" name="${this.name}[${inputNb}]" />
                        <button type="button" class="wtn-multi-text-input-remove" data-index="${inputNb}">-</button>
                    `);
                }
            },
            'container': {
                'click': e => {
                    const removeBtn = e.target.closest('.wtn-multi-text-input-remove');
                    if (!removeBtn) return;
                    const idx = parseInt(removeBtn.dataset.index);
                    const inputs = this.getRef('container').querySelectorAll('.wtn-multi-text-input-input');
                    const removeButtons = this.getRef('container').querySelectorAll('.wtn-multi-text-input-remove');
                    for (let i = idx + 1; i < inputs.length; i++) {
                        inputs[i].name = `${this.name}[${i - 1}]`;
                        removeButtons[i].dataset.index = i - 1;
                    }
                    inputs[idx].remove();
                    removeButtons[idx].remove();
                }
            }
        }
    }
    // Methods
    reset() {
        const inputs = this.getRef('container').querySelectorAll('.wtn-multi-text-input-input');
        const removeButtons = this.getRef('container').querySelectorAll('.wtn-multi-text-input-remove');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].remove();
            removeButtons[i].remove();
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    propertiesAttributes() {
        return ['name'];
    }
}

customElements.define(MultiTextInput.componentName(), MultiTextInput);
'use strict';

import tpl from './template.html'
import css from '!!raw-loader!./styles.css';
import { WontonMixin } from 'components/mixins/wonton';
import { I18nMixin } from 'components/mixins/i18n';
import { mix } from 'utils/mixins';

/**
 * Modal dialog web component. It content can be customized using slots.
 */
export default class WontonModalDialog extends mix(HTMLElement).with(WontonMixin, I18nMixin) {
    // Wonton config
    useShadowDOM() {
        return true;
    }
    static componentName() {
        return 'wtn-modal-dialog';
    }
    template() {
        return `
            <style>${css}</style>
            ${tpl}
        `;
    }
    references() {
        return {
            'okBtn': '.modal-dialog-btn-ok',
            'cancelBtn': '.modal-dialog-btn-cancel'
        }
    }
    listeners() {
        return {
            'okBtn': { 'click': () => this._ok() },
            'cancelBtn': { 'click': () => this._cancel() }
        }
    }
    propertiesAttributes() {
        return ['hideok', 'hidecancel'];
    }

    // I18n config
    i18nFilesPath() {
        return 'components/modal-dialog/i18n';
    }
    localeChangedCallback() {
        this.getRef('okBtn').innerText = this.i18n('modal-dialog.ok');
        this.getRef('cancelBtn').innerText = this.i18n('modal-dialog.cancel');
    }

    // Methods
    show() {
      // Trigger animation / transition
      if (this.hasAttribute('closing')) this.removeAttribute('closing');
      setTimeout(() => {
        this.setAttribute('opening', '');
        setTimeout(() => {
          this.removeAttribute('opening');
        }, 400);
        if (!this.hasAttribute('opened')) this.setAttribute('opened', '');
      }, 0);
    }
    hide() {
      // Trigger animation / transition
      if (this.hasAttribute('opening')) this.removeAttribute('opening');
      setTimeout(() => {
        this.setAttribute('closing', '');
        setTimeout(() => {
          this.removeAttribute('closing');
        }, 400);
        if (this.hasAttribute('opened')) this.removeAttribute('opened');
      }, 0);
    }
    _cancel() {
        this.hide();
        this.dispatchEvent(new Event('cancel'))
    }
    _ok() {
        this.hide();
        this.dispatchEvent(new Event('ok'));
    }

    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        this.getRef('okBtn').style.display = this.hideok === 'true' ? 'none' : 'inline-block';
        this.getRef('cancelBtn').style.display = this.hidecancel === 'true' ? 'none' : 'inline-block';
    }
    static get observedAttributes() {
        return ['hideok', 'hidecancel'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered || oldValue === newValue) return;
        switch (name) {
            case 'hideok':
                this.getRef('okBtn').style.display = newValue === 'true' ? 'none' : 'inline';
                break;
            case 'hidecancel':
                this.getRef('cancelBtn').style.display = newValue === 'true' ? 'none' : 'inline';
                break;
            default:
        }
    }
}
customElements.define(WontonModalDialog.componentName(), WontonModalDialog);
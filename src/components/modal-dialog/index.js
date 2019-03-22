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
    i18nFilesPath() {
        return 'components/modal-dialog/i18n';
    }
    localeChangedCallback() {
        this.getRef('okBtn').innerText = this.i18n('modal-dialog.ok');
        this.getRef('cancelBtn').innerText = this.i18n('modal-dialog.cancel');
    }

    open() {
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
}
customElements.define(WontonModalDialog.componentName(), WontonModalDialog);
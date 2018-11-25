'use strict';

import { BaseComponent } from "../base/index.js";
import i18n from './../../services/i18n/index.js';

/**
 * Locale chooser demo component.
 */
export class LocaleChooser extends BaseComponent {
    // Init
    constructor(props = {}) {
        // Extending props for the template
        const optionTpl = '<option class="cmp-locale-chooser_option-${locale}" value="${locale}"></option>';
        const localeOptions = i18n.supportedLocales.map(locale => optionTpl.replace(/\$\{locale\}/g, locale));
        Object.assign(props, { localeOptions });
        super(props);
    }
    componentName() {
        return 'cmp-locale-chooser';
    }
    template(props) {
        return `
            <select class="cmp-locale-chooser_select">
                <option class="cmp-locale-chooser_option-default" value=""></option>
                ${props.localeOptions}
            </select>
        `;
    }
    references() {
        return {
            'localeSelect': '.cmp-locale-chooser_select',
            'optionDefault': '.cmp-locale-chooser_option-default'
        }
    }
    listeners() {
        return {
            'localeSelect': {
                'change': () => i18n.locale = this.getRef('localeSelect').value || i18n.locale
            }
        }
    }
    refreshInnerTexts() {
        this.getRef('optionDefault').innerText = i18n.t('cmp.locale-chooser.choose-one');
        i18n.supportedLocales.forEach(locale => this.querySelector(`.cmp-locale-chooser_option-${locale}`).innerText = i18n.t(`cmp.locale-chooser.${locale}`));
    }
    localeChangedCallback(locale) {
        this.refreshInnerTexts();
        this.getRef('localeSelect').value = locale;
    }
    connectedCallback() {
        super.connectedCallback();
        this._i18nSubscription = i18n.subscribe(this);
        this.refreshInnerTexts();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._i18nSubscription.unsubscribe();
    }
}

customElements.define('locale-chooser', LocaleChooser);
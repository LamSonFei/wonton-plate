'use strict';

import { BaseComponent } from "../base/index.js";
import i18n from './../../services/i18n/index.js';
import { I18nComponent } from 'components/mixins/i18n';
import { mix } from 'utils/mixins';

/**
 * Locale chooser demo component.
 */
export class LocaleChooser extends mix(BaseComponent).with(I18nComponent) {
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
                ${props.localeOptions.reduce((elements, option) => elements + option, '')}
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
    localeChangedCallback(locale) {
        this.getRef('optionDefault').innerText = i18n.t('cmp.locale-chooser.choose-one');
        i18n.supportedLocales.forEach(locale => this.querySelector(`.cmp-locale-chooser_option-${locale}`).innerText = i18n.t(`cmp.locale-chooser.${locale}`));
        this.getRef('localeSelect').value = locale;
    }
}

customElements.define('locale-chooser', LocaleChooser);
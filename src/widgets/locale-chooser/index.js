'use strict';

import './styles.css';

import i18n from 'services/i18n/index.js';
import { WontonMixin } from 'components/mixins/wonton';
import { I18nMixin } from 'components/mixins/i18n';
import { mix } from 'utils/mixins';

/**
 * Locale chooser demo component.
 */
export class WontonLocaleChooser extends mix(HTMLElement).with(WontonMixin, I18nMixin) {
    // Init
    constructor(props = {}) {
        // Extending props for the template
        const optionTpl = '<option class="cmp-locale-chooser_option-${locale}" value="${locale}"></option>';
        const localeOptions = i18n.supportedLocales.map(locale => optionTpl.replace(/\$\{locale\}/g, locale));
        Object.assign(props, { localeOptions });
        super(props);
    }
    // Wonton config
    static componentName() {
        return 'wtn-locale-chooser';
    }
    template(props) {
        return `
            <label>
                Lang:
                <select class="cmp-locale-chooser_select">
                    <option class="cmp-locale-chooser_option-default" value=""></option>
                    ${props.localeOptions.reduce((elements, option) => elements + option, '')}
                </select>
            </label>
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
    // I18n config
    i18nFilesPath() {
        return 'widgets/locale-chooser/i18n';
    }
    localeChangedCallback(locale) {
        this.getRef('optionDefault').innerText = i18n.t('cmp.locale-chooser.choose-one');
        i18n.supportedLocales.forEach(locale => this.querySelector(`.cmp-locale-chooser_option-${locale}`).innerText = i18n.t(`cmp.locale-chooser.${locale}`));
        this.getRef('localeSelect').value = locale;
    }
}

customElements.define(WontonLocaleChooser.componentName(), WontonLocaleChooser);
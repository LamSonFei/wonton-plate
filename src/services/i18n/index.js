'use strict';

import { BaseComponent } from "components/base";
import { BehaviorSubject } from "rxjs";
import { get, merge } from "lodash";

/**
 * Internationalization service component.
 */
export class I18nService extends BaseComponent {
    // Init
    constructor() {
        super();
        // Bundle loading
        this._bundleMap = {};
        this._localeBroadcaster = new BehaviorSubject();
        this._localeBroadcaster.next('en');
    }
    componentName() {
        return 'i18n-service';
    }
    // Properties
    get defaultLocale() {
        return 'en';
    }
    get supportedLocales() {
        return ['en', 'fr'];
    }
    get locale() {
        return this.getAttribute('locale') || this.defaultLocale;
    }
    set locale(locale) {
        this.setAttribute('locale', locale);
        this._localeBroadcaster.next(locale);
    }
    get bundleMap() {
        return this._bundleMap;
    }
    // Methods
    /**
     * Adds a bundle to be merged to the currently managed one.
     * @param {Object} bundle the bundle to load
     * @param {String} locale the locale of the bundle
     */
    addBundle(bundle, locale) {
        locale = locale || this.locale;
        this._bundleMap[locale] = merge(this._bundleMap[locale] || {}, bundle);
    }
    /**
     * Gets a translation.
     * @param {String} path the path to the translation in the loaded bundle
     * @param {Object} params the parameters values replacing ${key} placeholders in the retrieved translation
     * @return the translation if found, an empty string otherwise
     */
    t(path, params = {}) {
        let text = get(this._bundleMap[this.locale], path);
        return Object.getOwnPropertyNames(params).reduce((formattedText, param) => {
            return formattedText.replace(new RegExp("\\$\\{" + param + "\\}", "g"), params[param]);
        }, text || '');
    }
    /**
     * Subscribes to this service to get the current locale at any time.
     * @param {Object|Function} config the callback configuration
     * @return the subscription
     */
    subscribe(config) {
        return this._localeBroadcaster.subscribe(config);
    }
    // Observed attributes
    static get observedAttributes() {
        return ['locale'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue) return;
        if (name === 'locale') {
            this._localeBroadcaster.next(this.locale);
        }
    }
    static get instance() {
        if (!I18nService._instance) {
            I18nService._instance = new I18nService();
        }
        return I18nService._instance;
    }
}

customElements.define('i18n-service', I18nService);

export default (I18nService.instance);
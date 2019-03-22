import log from 'services/log';
import i18n from 'services/i18n';

/**
 * Mixin binding a component to the i18n service.
 * @description In order for the mixin to work, the class using it must not extend connectedCallback 
 * or disconnectedCallback without calling the parent implementation.
 * Once the mixin is applied, the class should provide its own {@link I18nComponent#localeChangedCallback} implementation
 * to react on a locale change. The targeted class can also access the i18n service translation method by calling the {@link I18nComponent#i18n} function.
 * @param {Class} clazz the class to bind
 */
export function I18nMixin(clazz) {
    return class extends clazz {
        constructor(props) {
            super(props);
            if (typeof this.i18nFilesPath !== 'function') {
                log.warn(`${this.className}: missing required i18nFilesPath function`)
            } else {
                i18n.supportedLocales.forEach(locale => {
                    i18n.addBundle(this.i18nFilesPath(), locale);
                });
            }
        }

        /**
         * Hook to the lifecycle of the component to subscribe to the i18n service.
         * @override
         */
        connectedCallback() {
            super.connectedCallback();
            log.debug(`Subscribing ${this._componentName} to i18n service`);
            this._subscribeToI18nService();
        }

        /**
         * Hook to the lifecycle of the component to unsubscribe to the i18n service.
         * @override
         */
        disconnectedCallback() {
            super.disconnectedCallback();
            log.debug(`Unsubscribing ${this._componentName} from i18n service`);
            this._unsubscribeToI18nService();
        }

        /**
         * React to a locale change.
         * This is the function to override on the class using this mixin.
         */
        localeChangedCallback(locale) {
            log.debug(`Locale change to ${locale} detected by ${this._componentName}`);
        }

        /**
         * Executes a translation job.
         */
        i18n() {
            return i18n.t.apply(i18n, arguments);
        }

        /**
         * Subscribe to the i18n service with {@link I18nComponent#localeChangedCallback} as a callback.
         * @private
         */
        _subscribeToI18nService() {
            this._i18nSubscription = i18n.subscribe((locale => {
                this.localeChangedCallback.call(this, locale);
            }).bind(this));
        }

        /**
         * Unsubscribe to the i18n service.
         * @private
         */
        _unsubscribeToI18nService() {
            this._i18nSubscription.unsubscribe();
        }
    }
}

export default I18nMixin;
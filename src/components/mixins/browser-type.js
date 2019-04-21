import log from 'services/log';

/**
 * Mixin making available to the component if the current browser is meant for a mobile device or not.
 * It also adds a "data-browser-type" attribute to the component which can be valued as "mobile" or "desktop".
 * @description In order for the mixin to work, the class using it must not extend connectedCallback 
 * or disconnectedCallback without calling the parent implementation.
 * Once the mixin is applied, the targeted class can access the browser type by calling the {@link BrowserTypeMixin#browserType} function.
 * @param {Class} clazz the class to bind
 */
export function BrowserTypeMixin(clazz) {
    return class extends clazz {
        /**
         * Hook to the lifecycle of the component to subscribe to the i18n service.
         * @override
         */
        connectedCallback() {
            super.connectedCallback();
            this.browserType = navigator.userAgent.indexOf('Mobi') !== -1 ? 'mobile' : 'desktop';
        }

        /**
         * Gets the detected browser type.
         * @return {String} the browser type
         */
        get browserType() {
            return this.getAttribute('data-browser-type');
        }

        /**
         * Sets the detected browser type.
         * @param {String} browserType the browser type
         */
        set browserType(browserType) {
            this.setAttribute('data-browser-type', browserType);
        }
    }
}

export default BrowserTypeMixin;
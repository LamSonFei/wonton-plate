import log from 'services/log';
import WontonMixin from 'components/mixins/wonton';
import { mix } from 'utils/mixins';

/**
 * Base page component to be extended by pages of the application.
 */
export class BasePage extends mix(HTMLElement).with(WontonMixin) {
    connectedCallback() {
        super.connectedCallback();
        this.classList.add('page-base');
        log.debug(`Connected page ${this.constructor.componentName()}!`)
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        log.debug(`Disconnected page ${this.constructor.componentName()}!`)
    }
}
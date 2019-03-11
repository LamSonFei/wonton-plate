import log from 'services/log';
import { BaseComponent } from 'components/base';

/**
 * Base page component to be extended by pages of the application.
 */
export class BasePage extends BaseComponent {
    constructor(props) {
        super(props);
    }
    connectedCallback() {
        super.connectedCallback();
        this.classList.add('page-base');
        log.debug('Connected page!')
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        log.debug('Disconnected page!')
    }
}
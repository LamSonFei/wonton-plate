import log from 'services/log';
import { BaseComponent } from 'components/base';

/**
 * Base page component to be extended by pages of the application.
 */
export class BasePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.classList.add('page-base');
    }
    connectedCallback() {
        super.connectedCallback();
        log.debug('Connected page!')
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        log.debug('Disconnected page!')
    }
}
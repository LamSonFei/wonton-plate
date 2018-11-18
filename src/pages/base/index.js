import { BaseComponent } from './../../components/base/index.js';

export class BasePage extends BaseComponent {
    constructor(props) {
        super(props);
    }
    connectedCallback() {
        super.connectedCallback();
        console.log('Connected page!')
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        console.log('Disconnected page!')
    }
}
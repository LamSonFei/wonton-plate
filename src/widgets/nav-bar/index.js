'use strict';

import './styles.css';
import template from './template.html';

import 'components/locale-chooser';
import 'components/link';

import { WontonMixin } from 'components/mixins/wonton';
import { I18nMixin } from 'components/mixins/i18n';
import { mix } from 'utils/mixins';


/**
 * Internationalized navigation bar widget.
 */
export class NavBar extends mix(HTMLElement).with(WontonMixin, I18nMixin) {
    // Wonton config
    static componentName() {
        return 'nav-bar';
    }
    template() {
        return template;
    }
    references() {
        return {
            'home': '.nav-bar-home',
            'hello-john': '.nav-bar-hello-john',
            'form': '.nav-bar-form',
            'movies': '.nav-bar-movies'
        }
    }
    // I18n config
    i18nFilesPath() {
        return 'widgets/nav-bar/i18n';
    }
    localeChangedCallback() {
        this.refreshLabels();
    }
    // Methods
    refreshLabels() {
        Object.keys(this.references()).forEach(ref => this.getRef(ref).label = this.i18n(`nav-bar.links.${ref}`));
    }
    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        this.refreshLabels();
    }
}

customElements.define(NavBar.componentName(), NavBar);
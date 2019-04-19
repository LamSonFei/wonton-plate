'use strict';

import './styles.css';
import template from './template.html';

import 'components/form';
import 'components/multi-text-input';

import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';


/**
 * Movie card form component.
 */
export class MovieCardForm extends mix(HTMLElement).with(WontonMixin) {
    static componentName() {
        return 'wtn-movie-card-form';
    }
    template() {
        return template;
    }
    references() {
        return {
            'name': '.wtn-movie-card-name',
            'release': '.wtn-movie-card-release',
            'directors': '.wtn-movie-card-directors',
            'producers': '.wtn-movie-card-producers',
            'cast': '.wtn-movie-card-cast',
            'submitBtn': '.wtn-movie-card-submit',
            'form': '.wtn-movie-card-form'
        };
    }
    listeners() {
        return {
            'form': {
                'submit': e => {
                    e.preventDefault();
                    const movie = this.getRef('form').getJsonData();
                    movie.release = new Date(movie.release);
                    movie.likes = 0;
                    movie.dislikes = 0;
                    // TODO implement movie validation
                    const detail = movie;
                    this.dispatchEvent(new CustomEvent('add-movie', { detail }));
                }
            }
        }
    }
    // Methods
    submit() {
        this.getRef('form').dispatchEvent(new Event('submit', {
            'bubbles'    : true,
            'cancelable' : true
        }));
    }
    reset() {
        this.getRef('form').reset();
    }
    set movie(movie) {
        this._movie = movie;
    }
    refreshDisplay() {
        this.getRef('submitBtn').style.display = this.hidesubmit === 'true' ? 'none' : 'inline-block';
    }
    connectedCallback() {
        super.connectedCallback();
        this.refreshDisplay();
    }
    propertiesAttributes() {
        return ['hidesubmit'];
    }
    static get observedAttributes() {
        return ['hidesubmit'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered || oldValue === newValue) return;
        this.refreshDisplay();
    }
}

customElements.define(MovieCardForm.componentName(), MovieCardForm);
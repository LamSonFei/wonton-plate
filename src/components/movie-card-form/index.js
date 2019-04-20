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
    // Wonton config
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
            'form': '.wtn-movie-card-form',
            'nameInput': '.wtn-movie-card-name',
            'directorsInput': '.wtn-movie-card-directors',
            'producersInput': '.wtn-movie-card-producers',
            'castInput': '.wtn-movie-card-cast'
        };
    }
    listeners() {
        return {
            'form': {
                'submit': e => {
                    e.preventDefault();
                    const movie = this.getRef('form').getJsonData();
                    movie.release = new Date(movie.release);
                    movie.ratingTotal = this._movie ? this._movie.ratingTotal : 0;
                    movie.ratingCount = this._movie ? this._movie.ratingCount : 0;
                    // TODO implement movie validation
                    const detail = movie;
                    if (this.movie) {
                        detail.uid = this.movie.uid;
                        this.dispatchEvent(new CustomEvent('update-movie', { detail }));
                    } else {
                        this.dispatchEvent(new CustomEvent('add-movie', { detail }));
                    }
                    this.reset();
                }
            }
        }
    }
    propertiesAttributes() {
        return ['hidesubmit'];
    }
    // Custom properties
    set movie(movie) {
        if (!movie) {
            this.reset();
            return;
        }
        this._movie = { ...movie };
        this._movie.release = this._movie.release ? this._movie.release.toISOString().split('T')[0] : null;
        this.getRef('directorsInput').inputCount = (this._movie.directors || []).length;
        this.getRef('producersInput').inputCount = (this._movie.producers || []).length;
        this.getRef('castInput').inputCount = (this._movie.cast || []).length;
        this.getRef('nameInput').setAttribute('readonly', '');
        this.getRef('form').setJsonData(this._movie);
    }
    get movie() {
        return this._movie;
    }
    // Methods
    submit() {
        this.getRef('form').dispatchEvent(new Event('submit', {
            'bubbles'    : true,
            'cancelable' : true
        }));
    }
    reset() {
        this._movie = null;
        this.getRef('nameInput').removeAttribute('readonly');
        this.getRef('form').reset();
        this.getRef('form').querySelectorAll('wtn-multi-text-input').forEach(input => input.reset());
    }
    refreshDisplay() {
        this.getRef('submitBtn').style.display = this.hidesubmit === 'true' ? 'none' : 'inline-block';
    }
    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        this.refreshDisplay();
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
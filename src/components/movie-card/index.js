'use strict';

import './styles.css';
import template from './template.html';

import 'components/wonton-rating';

import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';


/**
 * Movie card component.
 */
export class MovieCard extends mix(HTMLElement).with(WontonMixin) {
    // Wonton config
    static componentName() {
        return 'wtn-movie-card';
    }
    template() {
        return template;
    }
    references() {
        return {
            'name': '.wtn-movie-card-name',
            'link': '.wtn-movie-card-link',
            'release': '.wtn-movie-card-release',
            'details': '.wtn-movie-card-details',
            'directors': '.wtn-movie-card-directors',
            'producers': '.wtn-movie-card-producers',
            'cast': '.wtn-movie-card-cast',
            'rating': '.wtn-movie-card-rating',
            'rateBtn': '.wtn-movie-card-rate-button',
            'deleteBtn': '.wtn-movie-card-delete-button',
            'editBtn': '.wtn-movie-card-edit-button'
        };
    }
    listeners() {
        return {
            'deleteBtn': {
                'click': () => {
                    this.dispatchEvent(new CustomEvent('delete-movie', {
                        bubbles: true,
                        composed: true,
                        detail: this._movie
                    }));
                }
            },
            'editBtn': {
                'click': () => {
                    this.dispatchEvent(new CustomEvent('edit-movie', {
                        bubbles: true,
                        composed: true,
                        detail: this._movie
                    }));
                }
            },
            'rateBtn': {
                'click': () => {
                    this.dispatchEvent(new CustomEvent('rate-movie', {
                        bubbles: true,
                        composed: true,
                        detail: this._movie
                    }));
                }
            }
        }
    }
    propertiesAttributes() {
        return ['hideedit', 'hidedelete', 'hiderate'];
    }
    // Custom properties
    /**
     * Sets the movie to display.
     * @param {Object} movie the movie to display
     */
    set movie(movie) {
        this._movie = movie;
        this.refreshDisplay();
    }
    /**
     * Gets the displayed movie.
     * @return {Object} the displayed movie
     */
    get movie() {
        return this._movie;
    }
    // Methods
    /**
     * Refreshes the display of the card depending on the movie to present.
     * @param {Boolean} refreshAll if all the card needs to be refreshed or just the ratings
     */
    refreshDisplay(refreshAll = true) {
        if (!this.isRendered) {
            setTimeout(() => {
                this.refreshDisplay(refreshAll);
            }, 0);
            return;
        }
        if (refreshAll) {
            this.getRef('directors').innerHTML = (this._movie.directors || []).reduce((list, director) => {
                return list + `<li><a rel="noreferrer" href="https://www.google.com/search?q=${'director%20' + encodeURI(director)}" target="_blank">${director}</a></li>`;
            }, '');
            this.getRef('producers').innerHTML = (this._movie.producers || []).reduce((list, producer) => {
                return list + `<li><a rel="noreferrer" href="https://www.google.com/search?q=${'producer%20' + encodeURI(producer)}" target="_blank">${producer}</a></li>`;
            }, '');
            this.getRef('cast').innerHTML = (this._movie.cast || []).reduce((list, actor) => {
                return list + `<li><a rel="noreferrer" href="https://www.google.com/search?q=${'actor%20' + encodeURI(actor)}" target="_blank">${actor}</a></li>`;
            }, '');
            this.getRef('name').textContent = this._movie.name || '[UNKNOWN]';
            this.getRef('link').href = `https://www.imdb.com/find?exact=true&q=${encodeURI(this._movie.name)}`;
            if (this._movie.release) {
                this.getRef('release').textContent = this._movie.release.toLocaleDateString('en-SG');
            }
        }
        this.getRef('editBtn').style.display = this.hideedit === 'true' ? 'none' : 'inline-block';
        this.getRef('deleteBtn').style.display = this.hidedelete === 'true' ? 'none' : 'inline-block';
        this.getRef('rateBtn').style.display = this.hiderate === 'true' ? 'none' : 'inline-block';
        this.getRef('rating').rating = this._movie.ratingCount ? this._movie.ratingTotal / this._movie.ratingCount : 0;
    }
    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        this.refreshDisplay();
    }
    static get observedAttributes() {
        return ['hideedit', 'hidedelete', 'hiderate'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered || oldValue === newValue) return;
        // Only ratings are dynamically linked to attributes
        this.refreshDisplay(false);
    }
}

customElements.define(MovieCard.componentName(), MovieCard);
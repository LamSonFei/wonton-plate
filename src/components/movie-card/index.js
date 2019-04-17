'use strict';

import './styles.css';
import template from './template.html';

import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';


/**
 * Movie card component.
 */
export class MovieCard extends mix(HTMLElement).with(WontonMixin) {
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
            'likes': '.wtn-movie-card-likes',
            'dislikes': '.wtn-movie-card-dislikes',
            'likesBtn': '.wtn-movie-card-likes-button',
            'dislikesBtn': '.wtn-movie-card-dislikes-button'
        };
    }
    // Methods
    set movie(movie) {
        this._movie = movie;
        this.refreshDisplay();
    }
    refreshDisplay() {
        if (!this.isRendered) {
            setTimeout(() => {
                this.refreshDisplay();
            }, 0);
            return;
        }
        this.getRef('directors').innerHTML = (this._movie.directors || []).reduce((list, director) => {
            return list + `<li><a href="https://www.google.com/search?q=${'director%20' + encodeURI(director)}" target="_blank">${director}</a></li>`;
        }, '');
        this.getRef('producers').innerHTML = (this._movie.producers || []).reduce((list, producer) => {
            return list + `<li><a href="https://www.google.com/search?q=${'producer%20' + encodeURI(producer)}" target="_blank">${producer}</a></li>`;
        }, '');
        this.getRef('cast').innerHTML = (this._movie.cast || []).reduce((list, actor) => {
            return list + `<li><a href="https://www.google.com/search?q=${'actor%20' + encodeURI(actor)}" target="_blank">${actor}</a></li>`;
        }, '');
        this.getRef('name').textContent = this._movie.name || '[UNKNOWN]';
        this.getRef('link').href = `https://www.imdb.com/find?exact=true&q=${encodeURI(this._movie.name)}`;
        const releaseDate = this._movie.release ? this._movie.release.toDate() : null;
        if (releaseDate) {
            this.getRef('release').textContent = releaseDate.toLocaleDateString('en-SG');
        }
        if (this.liked === 'true') {
            this.getRef('likesBtn').setAttribute('disabled', '');
            this.getRef('dislikesBtn').removeAttribute('disabled');
            this.getRef('dislikesBtn').style.display = 'none';
        }
        if (this.disliked === 'true') {
            this.getRef('dislikesBtn').setAttribute('disabled', '');
            this.getRef('likesBtn').removeAttribute('disabled');
            this.getRef('likesBtn').style.display = 'none';
        }
        this.getRef('likes').textContent = this._movie.likes || 0;
        this.getRef('dislikes').textContent = this._movie.dislikes || 0;
    }
    connectedCallback() {
        super.connectedCallback();
        this.refreshDisplay();
    }
    propertiesAttributes() {
        return ['liked', 'disliked'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered || oldValue === newValue) return;
        this.refreshDisplay();
    }
}

customElements.define(MovieCard.componentName(), MovieCard);
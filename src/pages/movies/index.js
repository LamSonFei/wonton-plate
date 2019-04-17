'use strict';

import './styles.css';
import template from './template.html';

import { BasePage } from 'pages/base';
import SimpleStore from 'stores/simple-store';

import 'components/movie-card';
import 'widgets/firestore-user-control';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export class MoviesPage extends BasePage {
    static componentName() {
        return 'page-movies';
    }
    template() {
        return template;
    }
    references() {
        return {
            'movieCards': '.movie-cards'
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Init data
        SimpleStore.get('user').subscribe(user => {
            if (!user.uid || SimpleStore.get('movies').getData('movies')) return;
            this._db = firebase.firestore();
            // Retrieve data
            this._db.collection("movies")
                .orderBy('name')
                .limit(20)
                .get()
                .then(querySnapshot => {
                    const movies = [];
                    querySnapshot.forEach(s => movies.push({
                        uid: s.id,
                        ...s.data()
                    }))
                    SimpleStore.get('movies').setData({ movies });
                });
        });
        this._moviesSubscription = SimpleStore.get('movies').subscribe(data => {
            const ratings = SimpleStore.get('user').getData().ratings;
            const fragment = document.createDocumentFragment();
            (data.movies || []).forEach(movie => {
                const movieCard = document.createElement('wtn-movie-card');
                movieCard.movie = movie;
                if (ratings) {
                    movieCard.liked = ratings[movie.uid] > 0;
                    movieCard.disliked = ratings[movie.uid] < 0;
                }
                fragment.appendChild(movieCard);
            });
            const movieCards = this.getRef('movieCards');
            while (movieCards.lastElementChild) {
                movieCards.removeChild(movieCards.lastElementChild);
            }
            movieCards.appendChild(fragment);
        });
    }
    disconnectedCallback() {
        this._moviesSubscription.unsubscribe();
    }
}

customElements.define('page-movies', MoviesPage);
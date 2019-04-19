'use strict';

import './styles.css';
import template from './template.html';

import { BasePage } from 'pages/base';
import SimpleStore from 'stores/simple-store';

import 'components/movie-card';
import 'components/movie-card-form';
import 'components/modal-dialog';
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
            'movieCards': '.movie-cards',
            'addBtn': '.movie-cards-new-control',
            'dialog': '.movie-cards-dialog',
            'dialogTitle': '.movie-cards-dialog-title',
            'dialogForm': '.movie-cards-dialog-form',
            'dialogFormSubmit': '.movie-cards-dialog-form-submit'
        }
    }
    listeners() {
        return {
            'addBtn': {
                'click': () => {
                    this.getRef('dialogTitle').textContent = "New Movie";
                    this.getRef('dialog').show();
                }
            },
            'dialogFormSubmit': {
                'click': () => {
                    this.getRef('dialogForm').submit();
                }
            },
            'dialogForm': {
                'add-movie': e => {
                    const movie = e.detail;
                    movie.author = SimpleStore.get('user').getData().uid;
                    this._db.collection("movies").add(movie);
                    this.getRef('dialog').hide();
                    this.getRef('dialogForm').reset();
                }
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Init data
        this._userSub = SimpleStore.get('user').subscribe(user => {
            this.getRef('addBtn').style.visibility =  (user.uid && !user.isAnonymous) ? 'visible' : 'hidden';
            if (user.uid && !SimpleStore.get('movies').getData('movies')) {
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
            }
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
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._userSub) this._userSub.unsubscribe();
        if (this._moviesSubscription) this._moviesSubscription.unsubscribe();
    }
}

customElements.define('page-movies', MoviesPage);
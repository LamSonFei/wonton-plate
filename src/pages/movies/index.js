'use strict';

import './styles.css';
import template from './template.html';

import { BasePage } from 'pages/base';
import SimpleStore from 'stores/simple-store';
import log from 'services/log';

import 'components/movie-card';
import 'components/movie-card-form';
import 'components/modal-dialog';
import 'widgets/firestore-user-control';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

/**
 * A page displaying HK movies and their ratings from a Firestore database.
 * It also enables the creation and the update of movie cards for logged in users.
 * It finally allows admin to delete any cards.
 */
export class MoviesPage extends BasePage {
    // Wonton config
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
                    this.getRef('dialogForm').reset();
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
                    this._needsRefreshing = true;
                    this._db.collection("movies").add(movie).then(() => {
                        log.debug('Successfully added', movie);
                    }, err => {
                        alert('Could not add the movie!');
                        log.error('Movie creation error', err);
                    });
                    this.getRef('dialog').hide();
                },
                'update-movie': e => {
                    const movie = e.detail;
                    this._needsRefreshing = true;
                    this._db.collection("movies").doc(movie.uid).update(movie).then(() => {
                        log.debug('Successfully updated', movie);
                    }, err => {
                        alert('Could not update the movie!');
                        log.error('Movie update error', err);
                    });
                    this.getRef('dialog').hide();
                }
            },
            'movieCards': {
                'edit-movie': e => {
                    const movieToEdit = e.detail;
                    const currentUser = SimpleStore.get('user').getData();
                    if (currentUser.uid !== movieToEdit.author && !currentUser.admin) {
                        alert('Not authorized!');
                        return;
                    }
                    this.getRef('dialogTitle').textContent = "Edit Movie";
                    this.getRef('dialogForm').movie = movieToEdit;
                    this.getRef('dialog').show();
                },
                'delete-movie': e => {
                    const currentUser = SimpleStore.get('user').getData();
                    if (!currentUser.admin) {
                        alert('Not authorized!');
                        return;
                    }
                    const movieToDelete = e.detail;
                    if (confirm(`You are about to delete the movie card "${movieToDelete.name}". Do you wish to proceed?`)) {
                        this._needsRefreshing = true;
                        this._db.collection('movies').doc(movieToDelete.uid).delete().then(() => {
                            log.debug('Successfully deleted', movieToDelete);
                        }, err => {
                            alert('Could not delete the movie!');
                            log.error('Movie deletion error', err);
                        });
                    }
                }
            }
        }
    }
    // Lifecycle
    connectedCallback() {
        super.connectedCallback();
        this._userSub = SimpleStore.get('user').subscribe(user => {
            // Only show the "Add Movie" button for non-anonymous users
            this.getRef('addBtn').style.visibility =  (user.uid && !user.isAnonymous) ? 'visible' : 'hidden';
            // Only download data if there is a logged-in user (even an anonymous one) and if the movies are not already pre-loaded
            if (user.uid && !SimpleStore.get('movies').getData('movies')) {
                this._db = firebase.firestore();
                // Retrieve data
                this._firestoreUnsubsribe = this._db.collection("movies")
                    .orderBy('name')
                    .onSnapshot(querySnapshot => {
                        const movies = [];
                        querySnapshot.forEach(s => movies.push({
                            uid: s.id,
                            ...s.data(),
                            release: s.data().release && !isNaN(s.data().release.toDate()) ? s.data().release.toDate() : null
                        }))
                        SimpleStore.get('movies').setData({ movies });
                    });
            }
            if (this._moviesSubscription) this._moviesSubscription.unsubscribe();
            this._moviesSubscription = SimpleStore.get('movies').subscribe(data => {
                const ratings = SimpleStore.get('user').getData().ratings;
                const movieCards = this.getRef('movieCards');
                if (!movieCards.hasChildNodes() || this._needsRefreshing) {
                    // Displays the list of movies
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
                    while (movieCards.lastElementChild) {
                        movieCards.removeChild(movieCards.lastElementChild);
                    }
                    movieCards.appendChild(fragment);
                    this._needsRefreshing = false;
                } else if (ratings) {
                    // Update only current user ratings if the movies have already been displayed
                    movieCards.childNodes.forEach(movieCard => {
                        movieCard.liked = ratings[movieCard.movie.uid] > 0;
                        movieCard.disliked = ratings[movieCard.movie.uid] < 0;
                    });
                }
            });
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._userSub) this._userSub.unsubscribe();
        if (this._moviesSubscription) this._moviesSubscription.unsubscribe();
        if (this._firestoreUnsubsribe) this._firestoreUnsubsribe();
    }
}

customElements.define(MoviesPage.componentName(), MoviesPage);
'use strict';

// Webpack styles imports
import './styles.css';

// Bundled pages
import 'pages/home';
import 'pages/form';
import 'pages/movies';

log.level = process.env.RUN_MODE === 'production' ? 'error' : 'debug';

log.info('Initializing...');

log.debug('Initializing Firestore connection!');
import firebase from 'firebase/app';
firebase.initializeApp({
    apiKey: "AIzaSyAVWXMeWwmfhesDjpi6qp-1_u0tjJkzRO8",
    authDomain: "wonton-movies.firebaseapp.com",
    databaseURL: "https://wonton-movies.firebaseio.com",
    projectId: "wonton-movies",
    storageBucket: "wonton-movies.appspot.com",
    messagingSenderId: "880408029705"
});
log.debug('Authenticating Firestore user!');
import 'firebase/auth';
import 'firebase/firestore';
import SimpleStore from 'stores/simple-store.js';
firebase.auth().onAuthStateChanged(() => {
    const user = firebase.auth().currentUser;
    if (user && !user.isAnonymous) {
        const db = firebase.firestore();
        Promise.all([
            db.collection("users-profiles")
                .doc(user.uid)
                .get(),
            // User ratings
            db.collection("users-ratings")
                .where('user', '==', user.uid)
                .get()
        ]).then(([profileDoc, querySnapshot]) => {
            if (profileDoc.exists) {
                Object.assign(user, profileDoc.data());
            }
            const ratings = {};
            querySnapshot.forEach(s => {
                const data = s.data();
                ratings[data.movie] = {
                    rating: data.rating,
                    uid: s.id
                }
            });
            user.ratings = ratings;
            SimpleStore.get('user').setData(user);
        });
    }
    SimpleStore.get('user').setData(user || {});
    if (!user) {
        firebase.auth().signInAnonymously();
    }
});

log.debug('Adding services components!');
import log from 'services/log';
import i18n from 'services/i18n';
import router from 'services/router';
const services = document.querySelector('.services');
services.append(log);
services.append(i18n);
services.append(router);

log.debug('Initializing routes!');
import routes from './routes.json';
router.subscribe(document.querySelector('.page'), routes);

log.debug('Initializing header!');
import { NavBar } from 'widgets/nav-bar';
document.querySelector('.header').append(new NavBar());

log.debug('Initializing footer!');
import { WontonLocaleChooser } from 'components/locale-chooser';
const footer = document.querySelector('.footer');
footer.append(new WontonLocaleChooser());
footer.insertAdjacentHTML('beforeend', '<a class="wtn-github-link" href="https://github.com/LamSonFei" rel="noreferrer" target="_blank">@LamSonFei</a>');

log.info('Application ready!');

// Webpack default PWA script
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js').then(registration => {
//             log.info('SW registered: ', registration);
//         }).catch(registrationError => {
//             log.warn('SW registration failed: ', registrationError);
//         });
//     });
// }

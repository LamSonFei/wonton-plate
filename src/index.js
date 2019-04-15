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
import SimpleStore from 'stores/simple-store';
firebase.auth().signInAnonymously();
firebase.auth().onAuthStateChanged(user => {
    if (!user) return;
    SimpleStore.get('user').setData(user);
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
document.querySelector('.footer').append(new WontonLocaleChooser());

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

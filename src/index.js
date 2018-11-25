'use strict';

// Webpack styles imports
import './styles.css'

// Dependencies imports
import log from 'services/log';
import { HomePage } from 'pages/home';

log.level = process.env.RUN_MODE === 'production' ? 'error' : 'debug';

log.info('Initializing...')

const homePage = new HomePage({ userName: 'Jim' });
document.querySelector('.main').append(homePage);

log.info('Application ready!')

// Webpack HRM
if (module.hot) module.hot.accept('./index.js', () => location.reload());

// Webpack PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
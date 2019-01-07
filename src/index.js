'use strict';

// Webpack styles imports
import './styles.css';

// Dependencies imports
import { merge, from } from "rxjs";

import log from 'services/log';
import i18n from 'services/i18n';
import router from 'services/router';

import 'pages/home';
import 'pages/form';

import { LocaleChooser } from 'components/locale-chooser';
import { Link } from 'components/link'

import routes from './routes.json';

log.level = process.env.RUN_MODE === 'production' ? 'error' : 'debug';

log.info('Initializing...');

log.debug('Loading services!');
document.querySelector('.services').append(i18n);

log.debug('Loading localization bundles!');

merge(
    from(import(`./components/hello-world/i18n/${i18n.defaultLocale}.json`)),
    from(import(`./components/locale-chooser/i18n/${i18n.defaultLocale}.json`))
)
.subscribe({
    next: bundle => i18n.addBundle(bundle, i18n.defaultLocale),
    complete: () => {
        log.debug('Localization bundles loaded!');

        log.debug('Initializing routes!');
        router.subscribe(document.querySelector('.page'), routes);
        
        const header = document.querySelector('.header');
        const homeLink = document.createElement('router-link');
        homeLink.setAttribute('path', '/home');
        homeLink.setAttribute('label', 'Home');
        header.append(homeLink);
        const formLink = new Link();
        formLink.label = 'Form';
        formLink.path = '/form';
        header.append(formLink);
        header.append(new LocaleChooser());

        document.querySelector('.footer').append(new LocaleChooser());

        log.info('Application ready!');
        
        // Webpack PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(registration => {
                    log.info('SW registered: ', registration);
                }).catch(registrationError => {
                    log.warn('SW registration failed: ', registrationError);
                });
            });
        }
    }
});

log.debug('Loading secondary localization bundles!');
i18n.supportedLocales.forEach(locale => {
    if (locale === i18n.defaultLocale) return;
    merge(
        from(import(`./components/hello-world/i18n/${locale}.json`)),
        from(import(`./components/locale-chooser/i18n/${locale}.json`))
    )
    .subscribe(bundle => i18n.addBundle(bundle, locale));
});

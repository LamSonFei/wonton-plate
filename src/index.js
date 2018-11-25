'use strict';

// Webpack styles imports
import './styles.css'

// Dependencies imports
import log from 'services/log';
import { HomePage } from 'pages/home';
import { LocaleChooser } from './components/locale-chooser/index.js';
import i18n from './services/i18n/index.js';
import { merge, from } from "rxjs";

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
        
        document.querySelector('.header').append(new LocaleChooser());
        document.querySelector('.page').append(new HomePage({userName: 'Jim'}));
        document.querySelector('.footer').append(new LocaleChooser());

        log.info('Application ready!')
        
        // Webpack HRM
        if (module.hot) module.hot.accept('./index.js', () => location.reload());
        
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

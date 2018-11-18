'use strict';

import { HomePage } from './pages/home/index.js';

const homePage = new HomePage({userName: 'Jim'});
document.querySelector('.main').append(homePage);

console.log('Application ready!')
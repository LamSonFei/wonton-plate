'use strict';

import { HomePage } from './pages/home/index.js';
import { HelloWorld } from './components/hello-world/index.js';

const homePage = new HomePage({userName: 'Jim'});
document.querySelector('.main').append(homePage);

console.log('Application ready!')
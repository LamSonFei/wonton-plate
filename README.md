# Web application starter kit only using Web Components v1

## Purpose

This is a base project with multiple objectives:
 * Practicing 'Native' Web Development from scratch.
 * Understanding the life cycle of Web Components and their usage/limitations/potential.
 * Avoiding the use of external libraries / frameworks to keep things lightweight
 * Building a full application template along with a CLI (coming later).

## Software template design description

This application template showcases how to use Web Components for the following use cases:
 * Static content delivery
 * Form management
 * Firestore integration

A few things to note before you get started with the template:
 * It uses Web Components spec v1 without any polyfill. It means no Edge v<=16 or any IE support. You can set up a polyfill such as [webcomponentjs](https://github.com/webcomponents/webcomponentsjs) or [WebReflection](https://github.com/WebReflection/document-register-element) if you want to support all browsers.
 * It still relies a lot on Webpack for code splitting and bundling, you might want to learn how to use it: [Getting started with Webpack](https://webpack.js.org/guides/getting-started/).
 * There is no Babel configuration. It uses pure ES6+ understandable only by the latest versions of browsers. You can set up an ES5 transpilation anytime though.
 * As I did not want to recode a reactive framework, it uses [RxJS](https://github.com/ReactiveX/rxjs) for the Observable pattern.
 * It uses [Lodash](https://github.com/lodash/lodash) for JS objects manipulation.
 * The router, i18n support, store implementation and "Wonton" way of writing components are custom-made and can be improved (a lot). They are provided as is without any guarantee or support (see license below).


## Usage

 To start a development server:
 ```
 npm run dev-server
 ```
 To build the demo:
 ```
 npm run build
 ```
To launch the built application:
 ```
 npm start
 ```

## Links

This project is automatically built using [Circle CI](https://circleci.com).  
A demo is also available, thanks to [Heroku](https://www.heroku.com), at https://wonton-plate.herokuapp.com.  
  
This project started at https://github.com/Zenika/wanton-template, but got moved to a personal repository by its author.  
You can can find the issue board here: https://github.com/LamSonFei/wonton-plate/issues.  
  
A fork is always available for Zenika at: https://github.com/Zenika/wonton-plate.

## Licensing

All the work in this repository is MIT Licensed.

MIT License

Copyright (c) 2019 Adrien Paul Nortain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

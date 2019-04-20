// This script initializes JSDOM for the unit tests

import { JSDOM } from 'jsdom';

global.window = new JSDOM("", {
  url: "http://localhost"
}).window;
global.document = window.document;
window.console = global.console;

global.navigator = {
  userAgent: "node.js"
};

var contexts = [require.context("./", true, /\.test\.js$/)];
contexts.forEach(function(context) {
  context.keys().forEach(context);
});

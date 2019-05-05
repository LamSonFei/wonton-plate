module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai"],
    files: ["test-dist/main.js"],
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless"],
    singleRun: true,
    autoWatch: false,
    concurrency: Infinity
  });
};

/**
 * Base logger class.
 */
class Logger {
    constructor() {
        this._active = false;
        this._levels = ['debug', 'info', 'warn', 'error', 'fatal'];
        this._level = 'info';
    }
    set level(level) {
        this._level = level;
    }
    get level() {
        return this._level;
    }
    get debugEnabled() {
        return this._levels.indexOf(this._level) == this._levels.indexOf('debug');
    }
    get infoEnabled() {
        return this._levels.indexOf(this._level) <= this._levels.indexOf('info');
    }
    get warnEnabled() {
        return this._levels.indexOf(this._level) <= this._levels.indexOf('warn');
    }
    get errorEnabled() {
        return this._levels.indexOf(this._level) <= this._levels.indexOf('error');
    }
}

/**
 * Simple console logger class.
 */
class ConsoleLogger extends Logger {
    constructor() {
        super();
    }
    static get instance() {
        if (!ConsoleLogger._instance) {
            ConsoleLogger._instance = new ConsoleLogger();
        }
        return ConsoleLogger._instance;
    }
    debug() {
        if (this.debugEnabled) {
            console.log.apply(console, arguments);
        }
    }
    info() {
        if (this.infoEnabled) {
            console.log.apply(console, arguments);
        }
    }
    warn() {
        if (this.warnEnabled) {
            console.warn.apply(console, arguments);
        }
    }
    error() {
        if (this.errorEnabled) {
            console.error.apply(console, arguments);
        }
    }
    fatal() {
        console.error.apply(console, arguments);
    }
}

export default ConsoleLogger.instance;
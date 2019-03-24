import { mix } from 'utils/mixins';

/**
 * Base logger mixin.
 * Requires that the extended class declares a 'level' getter function.
 */
function LoggerMixin(clazz) {
    return class extends clazz {
        constructor() {
            super();
            this._levels = ['debug', 'info', 'warn', 'error', 'fatal'];
        }
        get debugEnabled() {
            return this._levels.indexOf(this.level) == this._levels.indexOf('debug');
        }
        get infoEnabled() {
            return this._levels.indexOf(this.level) <= this._levels.indexOf('info');
        }
        get warnEnabled() {
            return this._levels.indexOf(this.level) <= this._levels.indexOf('warn');
        }
        get errorEnabled() {
            return this._levels.indexOf(this.level) <= this._levels.indexOf('error');
        }
    }
}

/**
 * Simple console logger class.
 */
class ConsoleLogger extends mix(HTMLElement).with(LoggerMixin) {
    constructor() {
        super();
    }
    static get instance() {
        if (!ConsoleLogger._instance) {
            ConsoleLogger._instance = new ConsoleLogger();
        }
        return ConsoleLogger._instance;
    }
    set level(level) {
        if (!this._levels.includes(level)) return;
        this.setAttribute('level', level);
    }
    get level() {
        return this.getAttribute('level') || 'info';
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
    // Observed attributes
    static get observedAttributes() {
        return ['level'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'level') {
            if (!this._levels.includes(newValue)) {
                this.setAttribute('level', 'info');
            }
        }
    }
}

customElements.define('log-service', ConsoleLogger);

export default ConsoleLogger.instance;
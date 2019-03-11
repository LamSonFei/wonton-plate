export default class RoutePath {

    constructor(parameterizedPath) {
        let trimmedPath = RoutePath.trimPath(parameterizedPath);
        this._isRoot = parameterizedPath === '/';
        if (!this._isRoot) {
            this._variables = {};
            this._parts = trimmedPath.split('/')
                .map((part, idx) => {
                    if (part.startsWith(':')) {
                        this._variables[idx] = part.substring(1);
                        return '[^\/]*';
                    }
                    return part;
                });
            this._regexp = new RegExp(`^${this._parts.join('\/')}$`);
        }
    }

    matches(path) {
        if (this._isRoot) return path === '/';
        return this._regexp.test(RoutePath.trimPath(path));
    }

    getPathVariables(path) {
        if (this._isRoot) return {};
        const parts = RoutePath.trimPath(path).split('/');
        if (parts.length !== this._parts.length) return {};
        return parts.reduce((variables, part, idx) => {
                if (this._variables[idx]) {
                    variables[this._variables[idx]] = part;
                }
                return variables;
            }, {});
    }

    static trimPath(path) {
        if (!path) return '';
        let trimmedPath = path;
        while (trimmedPath.endsWith('/')) {
            trimmedPath = trimmedPath.substring(0, trimmedPath.length-1);
        }
        while (trimmedPath.startsWith('/')) {
            trimmedPath = trimmedPath.substring(1);
        }
        return trimmedPath;
    }
}
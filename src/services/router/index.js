import RoutePath from "./routePath";

class RouterService {
    static get instance() {
        if (!RouterService._instance) {
            RouterService._instance = new RouterService();
            RouterService._instance._init();
        }
        return RouterService._instance;
    }
    subscribe(target, routes) {
        this._bindings = this._bindings || [];
        let preparedRoutes = routes.map(route => {
            let routePaths = route.paths.map(path => new RoutePath(path));
            return {
                ...route,
                routePaths
            };
        });
        const binding = {
            target: target,
            routes: preparedRoutes
        };
        this._bindings.push(binding);
        this._updateBinding(binding);
    }
    unsubscribe(target) {
        const idx = -1;
        this._bindings.some((binding, bindingIdx) => {
            if (binding === target) {
                idx = bindingIdx;
                return true;
            }
        });
        if (~idx) {
            this._bindings.splice(idx, 1);
        }
    }
    navigateTo(path) {
        if (path === window.location.pathname) return;

        window.history.pushState({}, document.title, path);
        
        this._bindings.forEach(binding => {
            binding.routes.forEach(route => {
                route.routePaths.some(routePath => {
                    if (!routePath.matches(path)) return false;
                    while (binding.target.lastChild) {
                        binding.target.removeChild(binding.target.lastChild);
                    }
                    const component = document.createElement(route.component);
                    binding.target.appendChild(component);
                    const pathVariables = routePath.getPathVariables(path);
                    Object.keys(pathVariables).forEach(key => {
                        const targetedProperty = route.propertiesMapping[key];
                        if (targetedProperty) {
                            component[targetedProperty] = pathVariables[key];
                        }
                    });
                    return true;
                });
            });
        });
    }

    _init() {
        window.onpopstate = () => {
            this._bindings.forEach(binding => {
                this._updateBinding(binding);
            });
        };
    }

    _updateBinding(binding) {
        const currentPath = window.location.pathname;
        binding.routes.forEach(route => {
            route.routePaths.some(routePath => {
                if (!routePath.matches(currentPath)) return false;
                while (binding.target.lastChild) {
                    binding.target.removeChild(binding.target.lastChild);
                }
                const component = document.createElement(route.component);
                binding.target.appendChild(component);
                const pathVariables = routePath.getPathVariables(currentPath);
                Object.keys(pathVariables).forEach(key => {
                    const targetedProperty = route.propertiesMapping[key];
                    if (targetedProperty) {
                        component[targetedProperty] = pathVariables[key];
                    }
                });
                return true;
            });
        });
    }

}

export default RouterService.instance;
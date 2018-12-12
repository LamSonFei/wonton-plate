/**
 * Utility function to mix a class with mixins using the syntax mix(clazz).with(mixin1, mixin2, ...).
 * @param {Class} clazz the class to mix
 */
export function mix(clazz) {
    return new MixinBuilder(clazz);
}

/**
 * A builder to chain mixins on a class.
 */
export class MixinBuilder {
    /**
     * @constructor
     * @param {Class} clazz  the class to mix with mixins
     */
    constructor(clazz) {
        this.clazz = clazz;
    }

    /**
     * Mixes the target class with the given mixins in the given order
     * @param  {...any} mixins the list of mixins
     */
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.clazz);
    }
}
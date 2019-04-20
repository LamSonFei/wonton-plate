'use strict';

import './styles.css';
import template from './template.html';

import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';


/**
 * Wonton rating component. Because you asked for it. Wait, what do you mean by "no"?
 */
export class WontonRating extends mix(HTMLElement).with(WontonMixin) {
    // Wonton config
    static componentName() {
        return 'wtn-rating';
    }
    template() {
        return template;
    }
    references() {
        return {
            'ratingContainer': '.wtn-rating-container',
            'ratingRatio': '.wtn-rating-ratio',
            'rating1': '.wtn-rating-wonton.wonton-1',
            'rating2': '.wtn-rating-wonton.wonton-2',
            'rating3': '.wtn-rating-wonton.wonton-3',
            'rating4': '.wtn-rating-wonton.wonton-4',
            'rating5': '.wtn-rating-wonton.wonton-5'
        }
    }
    listeners() {
        return {
            'ratingContainer': {
                'click': e => {
                    if (this.editable !== 'true') return;
                    const wonton = e.target.closest('.wtn-rating-wonton');
                    [1, 2, 3, 4, 5].some(rating => {
                        if (wonton.classList.contains(`wonton-${rating}`)) {
                            this.rating = rating;
                            return true;
                        }
                    });
                }
            }
        }
    }
    propertiesAttributes() {
        return ['rating', 'editable'];
    }
    // Methods
    /**
     * Refreshes the displayed rating.
     */
    refreshDisplay() {
        this.getRef('ratingRatio').style.width = ((Number(this.rating || 0) / 5) * 100) + 'px';
    }
    // Lifecycle
    static get observedAttributes() {
        return ['rating', 'editable'];
    }
    connectedCallback() {
        super.connectedCallback();
        this.refreshDisplay();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isRendered || oldValue === newValue) return;
        this.refreshDisplay();
    }
}

customElements.define(WontonRating.componentName(), WontonRating);
export default WontonRating;
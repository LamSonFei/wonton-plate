import 'components/wonton-rating';
import { expect } from 'chai';

describe('Wonton Rating', () => {
    describe('template', () => {
        it('should be rendered', done => {
            const rating = document.createElement('wtn-rating');
            document.body.appendChild(rating);
            const container = rating.getRef('ratingContainer');
            expect(container).to.exist;
            expect(container.classList.contains('wtn-rating-container')).to.be.true;
            done();
        });
        it('should display the correct rating', done => {
            const rating = document.createElement('wtn-rating');
            rating.rating = 3;
            document.body.appendChild(rating);
            const ratio = rating.getRef('ratingRatio');
            expect(ratio).to.exist;
            expect(ratio.classList.contains('wtn-rating-ratio')).to.be.true;
            expect(ratio.style.width).to.eq('60px');
            done();
        });
    });
    describe('custom element', () => {
        it('should be readonly by default', done => {
            const rating = document.createElement('wtn-rating');
            document.body.appendChild(rating);
            const ratio = rating.getRef('ratingRatio');
            expect(ratio.style.width).to.eq('0px');
            rating.getRef('rating4').dispatchEvent(new Event('click', { bubbles: true }));
            expect(ratio.style.width).to.eq('0px');
            done();
        });
        it('should support editable mode', done => {
            const rating = document.createElement('wtn-rating');
            rating.editable = true;
            document.body.appendChild(rating);
            const ratio = rating.getRef('ratingRatio');
            expect(ratio.style.width).to.eq('0px');
            rating.getRef('rating4').dispatchEvent(new Event('click', { bubbles: true }));
            expect(ratio.style.width).to.eq('80px');
            done();
        });
    });
});
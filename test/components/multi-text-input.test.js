import 'components/multi-text-input';
import { expect } from 'chai';

describe('Multi Text Input', () => {
    describe('template', () => {
        it('should have a container for inputs', done => {
            const input = document.createElement('wtn-multi-text-input');
            document.body.appendChild(input);
            const container = input.getRef('container');
            expect(container).to.exist;
            expect(container.classList.contains('wtn-multi-text-input-container')).to.be.true;
            done();
        });
        it('should initialized with a "+" button only', done => {
            const input = document.createElement('wtn-multi-text-input');
            document.body.appendChild(input);
            const container = input.getRef('container');
            expect(container.childElementCount).to.eq(1);
            const addButton = input.getRef('addBtn');
            expect(addButton).to.exist;
            expect(addButton).to.eq(container.lastElementChild);
            expect(addButton.classList.contains('wtn-multi-text-input-add')).to.be.true;
            expect(addButton.textContent).to.eq('+');
            done();
        });
    });
    describe('"+" button', () => {
        it('should add a new text input and its "-" button on click', done => {
            const input = document.createElement('wtn-multi-text-input');
            document.body.appendChild(input);
            const container = input.getRef('container');
            expect(container.childElementCount).to.eq(1);

            const addButton = input.getRef('addBtn');
            expect(input.childElementCount).to.eq(1);
            addButton.dispatchEvent(new Event('click'));

            expect(container.childElementCount).to.eq(3);
            expect(addButton).to.eq(container.lastElementChild);

            const textInput = container.children[0];
            expect(textInput.classList.contains('wtn-multi-text-input-input')).to.be.true;
            
            const minusButton = container.children[1];
            expect(minusButton.classList.contains('wtn-multi-text-input-remove')).to.be.true;

            done();
        });
    });
    describe('"-" button', () => {
        it('should remove its related text input', done => {
            const input = document.createElement('wtn-multi-text-input');
            document.body.appendChild(input);
            const container = input.getRef('container');

            const addButton = input.getRef('addBtn');
            addButton.dispatchEvent(new Event('click'));

            const textInput = container.children[0];
            expect(textInput.classList.contains('wtn-multi-text-input-input')).to.be.true;
            
            const minusButton = container.children[1];
            expect(minusButton.classList.contains('wtn-multi-text-input-remove')).to.be.true;

            minusButton.dispatchEvent(new Event('click', { bubbles: true }));
            
            expect(container.childElementCount).to.eq(1);
            expect(addButton).to.eq(container.lastElementChild);

            done();
        });
    });
});
import SimpleStore from 'stores/simple-store.js';
import { expect } from 'chai';

describe('Simple storage', () => {
    describe('initialization', () => {
        it('should provide an empty object', done => {
            expect(SimpleStore.get('testInit').getData()).to.eql({});
            done();
        });
    });
    describe('data manipulation', () => {
        it('should allow updating the internal data', done => {
            const store = SimpleStore.get('testSet');
            expect(store.getData()).to.eql({});
            const newData = {
                foo: '1',
                bar: 2
            };
            store.setData(newData);
            expect(store.getData()).to.eql(newData);
            done();
        });
        it('should allow updating part of the internal data', done => {
            const store = SimpleStore.get('testSetPartial');
            expect(store.getData()).to.eql({});
            const newData = {
                foo: '1',
                bar: {
                    foo: 2,
                    bar: 3
                }
            };
            store.setData(newData);
            expect(store.getData()).to.eql(newData);
            store.setData(4, 'bar.foo');
            expect(store.getData()).to.eql({
                foo: '1',
                bar: {
                    foo: 4,
                    bar: 3
                }
            });
            done();
        });
        it('should allow querying part of the internal data', done => {
            const store = SimpleStore.get('testGetPartial');
            expect(store.getData()).to.eql({});
            const newData = {
                foo: '1',
                bar: {
                    foo: 2,
                    bar: 3
                }
            };
            store.setData(newData);
            expect(store.getData('bar.foo')).to.eql(2);
            done();
        });
    });
    describe('multiple instances', () => {
        it('should update separately', done => {
            const store1 = SimpleStore.get('test1');
            const store2 = SimpleStore.get('test2');
            expect(store1.getData()).to.eql({});
            expect(store2.getData()).to.eql({});
            store1.setData({foo: 'bar'});
            expect(store1.getData()).to.eql({foo: 'bar'});
            expect(store2.getData()).to.eql({});
            done();
        });
    });
    describe('broadcast', () => {
        it('should notify subscribers', done => {
            const store = SimpleStore.get('testEvt');
            let value = null;
            store.subscribe(data => value = data);
            const newData = {
                foo: '1',
                bar: 2
            };
            store.setData(newData)
            expect(value).to.eql(newData);
            done();
        });
    });
});
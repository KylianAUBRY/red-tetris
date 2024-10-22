import { expect, describe, it } from 'vitest';
import Rand from '../Rand.js';

describe('Rand server', () => {
	it('call Rand', () => {
		let rand = new Rand(2);
		expect(rand.seed).toBe(2);
	});

	it('call Rand function set', () => {
		let rand = new Rand(2);
		rand.set(1);
		expect(rand.seed).toBe(1);
	});

	it('call Rand function next', () => {
		let rand = new Rand(2);
		let rand2 = new Rand(2);
		let rand3 = new Rand(3);
		let number;

		number = rand.next();
		expect(number).toBe(rand2.next());
		expect(number).not.toBe(rand3.next());
		number = rand.next();
		expect(number).toBe(rand2.next());
		expect(number).not.toBe(rand3.next());
		number = rand.next();
		expect(number).toBe(rand2.next());
		expect(number).not.toBe(rand3.next());
	});

	it('call Rand function nextInt', () => {
		let rand = new Rand(2);
		let rand2 = new Rand(2);
		let rand3 = new Rand(3);
		let number;

		number = rand.nextInt();
		expect(number).toBe(rand2.nextInt());
		expect(number).not.toBe(rand3.nextInt());
		number = rand.nextInt();
		expect(number).toBe(rand2.nextInt());
		expect(number).not.toBe(rand3.nextInt());
		number = rand.nextInt();
		expect(number).toBe(rand2.nextInt());
		expect(number).not.toBe(rand3.nextInt());
	});

	it('call Rand function shuf', () => {
		let rand = new Rand(2);
		let array = Array(10);
		for (let i = 0; i < 10; i++) {
			array[i] = i;
		}
		let tmpArray = { ...array };
		expect(rand.shuf(array)).not.toBe(tmpArray);
		rand.shuf(array);
		expect(rand.shuf(tmpArray)).not.toBe(array);
	});
});

class Rand {
	constructor(seed = Date.now()) {
		this.seed = seed;
	}

	next() {
		this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
		return this.seed / 2147483647;
	}

	nextInt(min = 0, max = 2147483647) {
		this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
		return Math.floor(min + (this.seed % (max - min + 1)));
	}

	shuf(array) {
		for (let i = array.length - 1; 0 < i; i--) {
			let randI = this.nextInt(0, i);
			let tmp = array[randI];
			array[randI] = array[i];
			array[i] = tmp;
		}
		return array;
	}
}

export default Rand;

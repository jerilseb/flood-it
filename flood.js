const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

class Square {

	constructor(game) {
		this.game = game;
		this.reset();
		ko.track(this);
	}

	reset() {
		this.controlled = false;
		this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
	}

	flood() {
		this.game.flood(this.color);
	}
}


class Game {

	constructor() {
		this.size = 14;
		this.moveCount = 0;
		this.expected = 25;
		this.rows = [];

		for (let i = 0; i < this.size; i ++) {
			let row = [];
			for (let j = 0; j < this.size; j ++) {
				row.push(new Square(this));
			}
			this.rows.push(row);
		}

		this.reset();
		ko.track(this);
	}


	reset() {

		this.moveCount = 0;
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
				this.rows[i][j].reset();
			}
		}

		this.rows[0][0].controlled = true;
		this.updateControlled();
	};


	updateControlled() {

		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {

				if (this.rows[i][j].controlled) {

					let color = this.rows[i][j].color;

					if (i > 0) {
						let up = this.rows[i - 1][j];
						if (up.color == color)
							up.controlled = true;
					}

					if (i < (this.size - 1)) {
						let down = this.rows[i + 1][j];
						if (down.color == color)
							down.controlled = true;
					}

					if (j > 0) {
						let left = this.rows[i][j - 1];
						if (left.color == color)
							left.controlled = true;
					}

					if (j < (this.size - 1)) {
						let right = this.rows[i][j + 1];
						if (right.color == color)
							right.controlled = true;
					}
				}
			}
		}
	}


	flood(color) {

		if (this.rows[0][0].color == color)
			return;

		this.moveCount ++;
		this.rows[0][0].color = color;
		let queue = [];

		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
				if (this.rows[i][j].controlled) {
					this.rows[i][j].color = color;
				}
			}
		}

		this.updateControlled();

		if (this.hasWon()) {
			let me = this;
			setTimeout(function() {
				if (me.moveCount <= me.expected)
					me.expected --;
				me.reset();
			}, 2000);
		}
	}


	hasWon() {
		let firstColor = this.rows[0][0].color;
		for (let i = 0; i < this.size; i ++) {
			for (let j = 0; j < this.size; j ++) {
				if (this.rows[i][j].color != firstColor) {
					return false;
				}
			}
		}
		return true;
	}


	askAboutReset() {
		let go;
		if ((this.moveCount) && (!this.hasWon()))
			go = confirm('Are you sure you want to reset?');
		else
			go = true;
		if (go)
			this.reset();
	}

}

ko.applyBindings(new Game);
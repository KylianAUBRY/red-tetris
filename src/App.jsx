import { ShowBoard } from './components/Board';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBlock, selectGrid } from './reducers/board';
import {
	setCoords,
	setShape,
	moveLeft,
	moveRight,
	moveDown,
	selectPiece,
} from './reducers/piece';
import { WIDTH, HEIGHT } from './constants';

function App() {
	const subtractionOfDeltaTime = 50;
	const grid = useSelector(selectGrid);
	const piece = useSelector(selectPiece);
	const dispatch = useDispatch();

	const [deltaTime, setDeltaTime] = useState(1000); // temps entre chaque changement de ligne en ms
	const deltaTimeRef = useRef(deltaTime);

	function checkPiece(x, y) {
		let tmpPiece = { ...piece };

		console.log('tmpPiece', tmpPiece);
		tmpPiece.x += x;
		tmpPiece.y += y;
		for (var tmpY = 0; tmpY < 3; tmpY++) {
			for (var tmpX = 0; tmpX < 3; tmpX++) {
				if (
					tmpPiece.shape[tmpY][tmpX] &&
					(tmpPiece.x + tmpX < 0 ||
						tmpPiece.x + tmpX >= WIDTH ||
						tmpPiece.y + tmpY >= HEIGHT ||
						grid[tmpPiece.y + tmpY][tmpPiece.x + tmpX])
				) {
					if (tmpPiece.x + tmpX < 0) {
						console.log(' < 0');
					}
					if (tmpPiece.x + tmpX >= WIDTH) {
						console.log('WIDTH');
					}
					if (tmpPiece.y + tmpY >= HEIGHT) {
						console.log('HEIGHT');
					}
					return false;
				}
			}
		}
		return true;
	}

	useEffect(() => {
		dispatch(setBlock({ x: 19, y: 9, color: 'red' }));
		dispatch(setBlock({ x: 19, y: 8, color: 'red' }));
		dispatch(setBlock({ x: 19, y: 7, color: 'blue' }));
		dispatch(setBlock({ x: 15, y: 0, color: 'blue' }));

		dispatch(setCoords({ x: 0, y: 0 }));
		dispatch(
			setShape([
				[null, 'blue', null],
				['blue', 'blue', 'blue'],
				[null, null, null],
			])
		);
	}, [dispatch]);

	useEffect(() => {
		deltaTimeRef.current = deltaTime; // Met à jour la référence à chaque changement de deltaTime
	}, [deltaTime]);

	useEffect(() => {
		const decreaseInterval = setInterval(() => {
			setDeltaTime((prevDeltaTime) =>
				Math.max(100, prevDeltaTime - subtractionOfDeltaTime)
			);
		}, 1000);
		return () => clearInterval(decreaseInterval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (checkPiece(0, 1) == true) {
				dispatch(moveDown());
			}
		}, deltaTimeRef.current);

		return () => clearInterval(interval);
	}, [deltaTime]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'ArrowLeft') {
				if (checkPiece(-1, 0) == true) {
					dispatch(moveLeft());
				}
			} else if (event.key == 'ArrowUp') {
				console.log('up');
			} else if (event.key == 'ArrowRight') {
				if (checkPiece(1, 0) == true) {
					dispatch(moveRight());
				}
			} else if (event.key == 'ArrowDown') {
				dispatch(moveDown());
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [piece]);

	return (
		<div>
			<ShowBoard />
		</div>
	);
}

export default App;

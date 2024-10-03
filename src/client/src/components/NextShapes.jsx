import React from 'react';
import './NextShapes.css';

import { useSelector } from 'react-redux';
import { selectNextShape } from '../reducers/nextShapes';

function fitShape(shape) {
	let top = 0;
	let bottom = shape.length;
	let left = shape[0].length;
	let right = 0;

	shape.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell) {
				top = Math.max(top, y);
				bottom = Math.min(bottom, y);
				left = Math.min(left, x);
				right = Math.max(right, x);
			}
		});
	});

	return shape.slice(bottom, top + 1).map((row) => row.slice(left, right + 1));
}

export default function NextShapes() {
	const shapes = useSelector(selectNextShape);
	return (
		<div className='nextShapes-box'>
			{shapes.map((shape, index) => {
				const fitedShape = fitShape(shape);

				if (fitedShape.length) {
					return (
						<div
							key={index}
							className='nextShapes-grid'
							style={{
								'--row-count': fitedShape.length,
								'--col-count': fitedShape[0].length,
							}}
						>
							{fitedShape.map((row, rowIndex) =>
								row.map((cell, colIndex) => {
									return (
										<div
											key={`${rowIndex}-${colIndex}`}
											className={cell ? 'nextShapes-cell' : null}
											style={{ '--cell-color': cell }}
										></div>
									);
								})
							)}
						</div>
					);
				}
			})}
		</div>
	);
}

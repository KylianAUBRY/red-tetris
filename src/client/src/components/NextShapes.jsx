import React from 'react';
import './NextShapes.css';

import { useSelector } from 'react-redux';
import { selectNextShape } from '../reducers/nextShapes';

export function NextShapes() {
	const shapes = useSelector(selectNextShape);
	

	return (
		<div className="nextShape-board">
			 {shapes.map((piece, index) => {
				var tmpLigne = piece.length;
				if (tmpLigne == 4){
					tmpLigne = 1;
				}
				else if (tmpLigne == 3 && !piece[2][1]) {
					tmpLigne --;
				}
				return (
				<div 
					key={index}
					className="nextShapes-grid"
					style={{
						gridTemplateRows: `repeat(${tmpLigne}, 25px)`,
						gridTemplateColumns: `repeat(${piece.length}, 25px)`,
					  }}
				>
					{piece.map((row, rowIndex) => 
						row.map((cell, colIndex) => {
							if ((piece.length != 3 || piece[2][1] || rowIndex != 2) && piece.length != 4 || rowIndex == 1) {
								return (
									<div
										key={`${rowIndex}-${colIndex}`}
										className={`NextShape-cell`}
										style={{ '--piece-color': cell }}
									>
										{(cell) && <div className='inner-square'></div>}
									</div>
								);
							}
						}),
					)}
				</div>
				)
				}
			)}
		</div>
	);
}

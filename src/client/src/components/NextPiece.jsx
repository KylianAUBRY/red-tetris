import React from "react";
import "./NextPiece.css";

import { useSelector } from "react-redux";
import { selectNextShape } from "../reducers/nextShapes";

export function NextPiece() {
	const pieces = useSelector(selectNextShape);

	return (
		<div className="next-piece-grid">
			 {pieces.map((shape, index) => {
				return (
				<div key={index} className="next-piece-grid">
					{shape.map((row, rowIndex) => 
						row.map((cell, colIndex) => {
							//www

							return (
								<div>
									
								</div>
							);
						}),
					)}
				</div>
				)
}
			)}
		</div>
	);
}
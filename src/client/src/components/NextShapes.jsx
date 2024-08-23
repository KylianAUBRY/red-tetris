import React from "react";
import "./NextShapes.css";

import { useSelector } from "react-redux";
import { selectNextShape } from "../reducers/nextShapes";

export function NextShapes() {
	const pieces = useSelector(selectNextShape);

	return (
		<div className="next-shapes-grid">
			 {pieces.map((shape, index) => {
				return (
				<div key={index} className="next-shapes-grid">
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
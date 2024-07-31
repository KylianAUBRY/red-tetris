export function ShowBoard () {
	const rows = 20;
	const cols = 10;
	const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

	grid[19][9] = 'red';
	grid[19][8] = 'red';
	grid[19][7] = 'blue';
	grid[5][5] = 'green';

	return (
		<div className="game-box">
			<div className="tetris-grid">
				{grid.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<div
						  key={`${rowIndex}-${colIndex}`}
						  className={`tetris-cell`}
						  style={{ '--piece-color': cell}}
						>
							{cell && <div className="inner-square"></div>}
						</div>
					))
        		)}
      		</div>
    	</div>
  	);
};
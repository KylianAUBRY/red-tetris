import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectGrid } from '../reducers/board';

function useGridRef() {
	const grid = useSelector(selectGrid);
	const gridRef = useRef(grid);

	useEffect(() => {
		gridRef.current = grid;
	}, [grid]);

	return gridRef;
}

export default useGridRef;

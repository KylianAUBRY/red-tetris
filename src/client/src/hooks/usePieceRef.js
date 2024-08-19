import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPiece } from '../reducers/piece';

function usePieceRef() {
	const piece = useSelector(selectPiece);
	const pieceRef = useRef(piece);

	useEffect(() => {
		pieceRef.current = piece;
	}, [piece]);

	return pieceRef;
}

export default usePieceRef;

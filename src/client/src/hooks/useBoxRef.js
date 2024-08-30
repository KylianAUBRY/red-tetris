import { useEffect, useRef } from 'react';

function useBoxRef(value) {
	const ref = useRef(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref;
}

export default useBoxRef;

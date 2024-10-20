import {expect, describe, beforeEach, it} from 'vitest';
import useBoxRef from '../useBoxRef.js'
import React, { useState } from 'react';
import { render, act } from '@testing-library/react';

function TestComponent({ value }) {
	const [_, setValue] = useState(value);
	const ref = useBoxRef(value);

	React.useEffect(() => {
	  setValue(value);
	}, [value]);
  
	return <div>{ref.current}</div>;
  }
describe('useBoxRef Component', () => {
	it('renders without crashing', () => {
		const { rerender, getByText } = render(<TestComponent value="Initial" />);

		expect(getByText('Initial')).toBeTruthy();
		rerender(<TestComponent value="Updated" />);
		expect(getByText('Updated')).toBeTruthy();
	});
});
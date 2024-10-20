import {expect, describe, beforeEach, it} from 'vitest';
import BoardSpectre from '../BoardSpectre.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { WIDTH } from '../../../../constants.js';


describe('BoardSpectre Component', () => {

    it('renders without crashing', () => {
		const colHeights = Array(WIDTH).fill(1);
			const { container } = render(
				<BoardSpectre colHeights={colHeights}/>
			);
	  });
	

});
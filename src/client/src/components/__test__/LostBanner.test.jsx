import {expect, describe, beforeEach, it} from 'vitest';
import LostBanner from '../LostBanner.jsx'
import React from 'react';
import { render } from '@testing-library/react';

describe('LostBanner Component', () => {
	it('renders without crashing', () => {
		render(
			<LostBanner />
		);
	});
});
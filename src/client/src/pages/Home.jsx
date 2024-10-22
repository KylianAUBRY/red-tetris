import React from 'react';
import './Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectErrorMsg } from '../reducers/error';

export default function Home() {
	const navigate = useNavigate();
	const errorMsg = useSelector(selectErrorMsg);

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(e.target.elements.room);
		const username = encodeURIComponent(e.target.elements.username.value);
		const room = encodeURIComponent(e.target.elements.room.value);

		if (username && room) {
			navigate(`/${room}/${username}`);
		}
	};

	return (
		<>
			<Header />
			<div className='Home'>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						placeholder='USERNAME'
						id='username'
						autoComplete='username'
						required
					></input>
					<input
						type='text'
						placeholder='ROOM'
						id='room'
						autoComplete='room'
						required
					></input>
					<button type='submit'>JOIN</button>
					<p>{errorMsg}</p>
				</form>
			</div>
			<Footer />
		</>
	);
}

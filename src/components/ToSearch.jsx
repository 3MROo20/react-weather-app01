import React, { useState, useRef, useEffect, use } from 'react';
import { useNavigate } from "react-router-dom";
import gsap from 'gsap';
import { useWeatherStore, useAppStore } from './stores';

function ToSearch() {
	const [grow, setGrow] = useState(false);
	const [visible, setVisible] = useState(false);

	// selectors style is recommended for performance and when there many components
	const setCity = useWeatherStore((s) => s.setCity);
	const fetchWeather = useWeatherStore((s) => s.fetchWeather);
	const city = useWeatherStore((s) => s.city);
	const loading = useWeatherStore((s) => s.loading);

	const navigate = useNavigate();
	const pRef = useRef(null);

{/* Search icon */}
 const svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
 	viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"
 	strokeLinecap="round" strokeLinejoin="round">
<circle cx="11" cy="11" r="8"/> <line x1="23" y1="23" x2="16.65" y2="16.65"/>
 	 </svg>



	function handleClick() {
 		setGrow(true);
 }



	useEffect(() => {

		let timer;
 	 	if(grow) {
 	 	timer = setTimeout(() => {
 	 	 setGrow(false);
 	 	}, 100000);
 	 }
 	 return () => clearTimeout(timer);
 	 }, [grow]);

	useEffect(() => {
		let Timer;
		if(grow) {
		Timer = setTimeout(() => {
		setVisible(true);
		}, 900);
	}
		else {
			setVisible(false);
		}
		return () => clearTimeout(Timer);
	}, [grow]);

	useEffect(() => {
		let toTime;
		if(grow) {
			pRef.current.style.display = 'none';
			pRef.current.style.opacity = '0';
		}
		else {
			toTime = setTimeout(() => {
			pRef.current.style.display = 'block';
			pRef.current.style.opacity = '1';
			}, 1300);
		}
		return () => clearTimeout(toTime);
	}, [grow]);



		// Main Navigation logic
		const handleKeyDown = async () => {
				setCity(city);

				await fetchWeather();
				navigate('/result');

		};


		const Icon = loading
			? (
				<div className="flex items-center justify-center size-6 md:size-8 pl-1 pr-2 md:px-1">
					<div className="size-4 md:size-4 border-4 border-dotted border-blue-700 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)
			: svg;


	 return (
	 	<div className="barXplaceholder">
	 	 {/*SearchBar part*/}
		<button className="searchBtn" onClick={handleClick} style={{
		  width: grow && 'clamp(17rem, 13rem + 20vw, 22rem)',
		  transition: 'all 1.5s ease',
		}}>{Icon} {grow && <input style={{opacity: visible ? "1" : "0"}}
			value={city} onChange={(e) => setCity(e.target.value)}
			type="text" placeholder="Search"
			onKeyDown={(e) => {if (e.key === 'Enter') handleKeyDown(); }}
				/>}
			</button>

		 {/*Placeholder part*/}
		<div className="PHolder" style={{ width: grow && '0', border: grow && '0'}}>
			<p ref={pRef} style={{ opacity: '1', translateX: '0'}}>
			Enter a city name</p>
			 </div>
		</div>
	);
}

export default ToSearch;

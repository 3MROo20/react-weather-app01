import { useState, useRef, useEffect } from 'react';
import './App.css'

export default function WeatherApp() {
	const [ active, setActive ] = useState(false);


// const bgColor = active ? "container" : "container-grid";

	return (
	<div className={`container ${active && "grid"}`} onDoubleClick={() => setActive(!active)}>
	 <Clock/>  
	 <TheSun />
	 <ToSearch />
	 <TheTree />
	 <TextCard />
	</div>
);
}
// for real time data 
function Clock() {
  const [time, setTime] = useState(new Date());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(timer); // cleanup
  }, []);

  useEffect(() => {
  	let pulser
  	pulser = setInterval(() => {
  		setPulse(prev => !prev);
  	}, 60000);

  	return() => clearInterval(pulser);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return <p style={{animation: pulse &&  'pulse 15s ease 1'}} className="time">{formattedTime}</p>;
}

function TheSun() {
		const [rotate, setRotate] = useState(false);

	useEffect(() => {
		let rotater;
		rotater = setTimeout(() => {
			setRotate(true);
		}, 1500); 
	}, []);

	return (
	  <img  className="Sun" src="/src/suny-day.png"id="sun" style={{animation: rotate && 'rotate 15s linear infinite'}}/>
	);
}

// how to add an element using state 
// function toInput() {
//  		const [elements, setElements] = useState([<input/>]);

//  		return (
//  		<div>			{/*to add a new elemenet*/}		// maping through the array
//  		 {elements.map((el, i) => (<div key={i}>{el}</div>))}
//  		</div>
//  		setElements([...elements, <input key={i} placeholder="Search"/>]); // adding the elements
//  			);
//  		// if(input.trim() === "") return;
//  		// setInput(e.target.value);
//  	}

function ToSearch() {
	const [grow, setGrow] = useState(false);
	const [input, setInput] = useState("");
	const [visible, setVisible] = useState(false);

	function handleClick() {
 		setGrow(true);
 }
 	/* In React, Hooks cannot be inside a function or conditionals or loops
 	they must alwasy be at the top level of the component, that's why at first it wasn't working cause it was inside handleClick funciton*/
	useEffect(() => {
		let timer;
 	 	if(grow) {
 	 	timer = setTimeout(() => {
 	 	 setGrow(false);
 	 	}, 11000); 
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

 const svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="11" cy="11" r="8"/>
    <line x1="23" y1="23" x2="16.65" y2="16.65"/> </svg>

 // const state = grow ? "PHshrinked" : "PHstretched";
	 return (
	 	<div className="barXplaceholder">
	 	 {/*SearchBar part*/}
		<button className="searchBtn" onClick={handleClick} style={{
		  width: grow && 'clamp(17rem, 13rem + 20vw, 25rem)',
		  transition: 'all 1s ease',
		}}>{svg} {grow && <input style={{opacity: visible ? "1" : "0"}} value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Search"/>}</button>   

		 {/*Placeholder part*/}
		<div className="P-container" style={{ width: grow && '0.1px'}}><p className="PHolder"
		  style={{ display: grow && 'none'}}>Enter a city name</p></div>
		</div>
	);
}

function TheTree() {
	const [slide, setSlide] = useState(false);

	useEffect(() => {
		let slider;
		slider = setInterval(() => {
			setSlide(prev => !prev);
		}, 15000);
		return () => clearInterval(slider);
	}, []);

		return (
			<>
			<img className="Tree" src="/src/windyTree.png" style={{animation: slide && 'slide 15s ease-in-out'}}  />
			<TextCard slide={slide} />
			</>
			);
}

function TextCard({slide}) {			/*props are basically how components talk to each other, you define a state in one place and pass it down to whoever needs it*/
		const [flip, setFlip] = useState(false);

		useEffect(() => {
			let fliper;
			if(slide) {
				fliper = setInterval(() => {
					setFlip(prev => !prev);
				}, 5000);
			}
			return () => clearInterval(fliper);
		}, [slide]);

	 return (
	 	<div className="textCard" 
	 	style={{background: 
	 	flip &&'linear-gradient(to right, #FFFFFF00 17%, #FFFFFF 70%)',
	 transition: 'all 1s ease-in-out'}}>
	 		<p>Rainy, windy, or a nice  sunny day, which <br/>one could it be</p>
	 	</div>
	 	);
}


{/* 1. Remember to remove placeholder extra padding and add letter spacing and let the p delay a bit after it's visible again* /}
 {/* 2. make an API card instead of a hardcoded card */}
{/*3. link the tree animation with the card getting flipped animaton when the tree leaves the screen the card gets flipped */}
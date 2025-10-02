import './index.css';
import { useState, useRef, useEffect } from 'react';


export default function WeatherApp() {
	const [ active, setActive ] = useState(false);


// const bgColor = active ? "container" : "container-grid";

	return (
	<div className={`container ${active && "grid"}`} 
		onDoubleClick={() => setActive(!active)}>
	 <Clock/>  
	 <TheSun />
	 <ToSearch />
	 <TheTree />
	 {/*<TextCard />*/}
	 <APIcard />
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

  return <p style={{animation: pulse &&  'pulse 15s ease 1'}} 
  	className="time">{formattedTime}</p>;
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
	  <img  className="Sun" src="/src/suny-day.png"id="sun" 
	  style={{animation: rotate && 'rotate 15s linear infinite'}}/>
	);
}

// how to add an element using state 
// function toInput() {
//  		const [elements, setElements] = useState([<input/>]);

//  	return (
//		<div>			{/*to add a new elemenet*/}		// maping through the array
//	 {elements.map((el, i) => (<div key={i}>{el}</div>))}
//  	</div>			// adding the elements
//  	setElements([...elements, <input key={i} placeholder="Search"/>]);
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
 	they must alwasy be at the top level of the component, that's why at 
 	first it wasn't working cause it was inside handleClick funciton*/
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

 const svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
 	viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" 
 	strokeLinecap="round" strokeLinejoin="round"> 
<circle cx="11" cy="11" r="8"/> <line x1="23" y1="23" x2="16.65" y2="16.65"/>
 	 </svg>

 // const state = grow ? "PHshrinked" : "PHstretched";
	 return (
	 	<div className="barXplaceholder">
	 	 {/*SearchBar part*/}
		<button className="searchBtn" onClick={handleClick} style={{
		  width: grow && 'clamp(17rem, 13rem + 20vw, 25rem)',
		  transition: 'all 1.5s ease',
		}}>{svg} {grow && <input style={{opacity: visible ? "1" : "0"}} 
			value={input} onChange={(e) => setInput(e.target.value)} 
			type="text" placeholder="Search"/>}</button>   

		 {/*Placeholder part*/}
		<div className="P-container" style={{ width: grow && '0.1px'}}>
			<p className="PHolder" style={{ display: grow && 'none'}}>
			Enter a city name</p></div>
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
			<img className="Tree" src="/src/windyTree.png" style=
				{{animation: slide && 'slide 15s ease-in-out'}}  />
			{/*<TextCard slide={slide} />*/}
			</>
			);
}

// function TextCard({slide}) {		/*props are basically how components 
// talk to each other, you define a state in one place and pass it down
// to whoever needs it*/
// 		const [flip, setFlip] = useState(false);

// 		useEffect(() => {
// 			let fliper;
// 			if(slide) {
// 				fliper = setInterval(() => {
// 					setFlip(prev => !prev);
// 				}, 5000);
// 			}
// 			return () => clearInterval(fliper);
// 		}, [slide]);

// 	 return (
// 	 	<div className="textCard" 
// 	 	style={{background: 
// 	 	flip &&'linear-gradient(to right, #FFFFFF00 17%, #FFFFFF 70%)',
// 	 transition: 'all 1s ease-in-out'}}>
// 	 		<p>waiting for API...</p>
// 	 	</div>
// 	 	);
// }

function APIcard() {
			const [quote, setQuote] = useState(null);
			const [next, setNext] = useState(false);

		useEffect(() => {
				let switcher;

			const fetchData = async () => {
					try {
			const res = await fetch("https://api.api-ninjas.com/v1/quotes", {
				method: 'Get',
				headers: {
					'X-Api-Key': 'ubDKKf7I6bD1QdKa1xYrdg==qkR4uAnQAFKwNM7V',
					'Content-Type': 'application/json',
				},
					});
			
		    	const data = await res.json(); 
		    switcher = setInterval(() => {
		     setNext(prev => !prev);
				 }, 10000);
					setQuote(data[0], data[1]); // api returns the array, we take 
																	// first quote, second author
					} catch (err) {
						console.error(err);
					}
						
				};

				fetchData();
				return () => clearInterval(switcher);
			}, [next]);

			if (!quote) return <div className="flex justify-start items-center
				row-start-4"> 
				<p className="text-base sm:text-md md:text-lg 
					font-bold transition">Loading...</p></div>

				// const quoteText = next ? quote.quote : '';
		return (
			<>
			<div className="bg-gray-100 opacity-80 max-w-md max-w-auto h-34 sm:h-42 
		md:h-44 lg:h-54 transition col-span-3 rounded-2xl text-center 
		overflow-hidden flex row-start-3 self-start px-2">
<p className="self-center text-sm sm:text-base md:text-lg
	lg:text-xl">{quote.quote}
	</p> 
</div>
	{/*<p className="text-sm items-center">By {quote.author}</p>*/}
			{/*<TextCard text={data}/>*/}
			</>
	);
}




{/* 1. Remember to remove placeholder extra padding and add letter 
spacing and let the p delay a bit after it's visible again* /}
{/*2. link the tree animation with the card getting flipped animaton
when the tree leaves the screen the card gets flipped */}
{/*Well done with API + Tailwind today, now don't forget to
add the author(data[1]) and lineargradient transistion*/}
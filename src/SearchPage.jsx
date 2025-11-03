import React from 'react';
import { useState, useRef, useEffect, } from 'react';
import { useNavigate } from "react-router-dom";
import './index.css';
// import Spline from '@splinetool/react-spline';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture } from '@react-three/drei';

// import ResultPage from './ResultPage';


export default function SearchPage() {
	const [ active, setActive ] = useState(false);


// const bgColor = active ? "container" : "container-grid";

	return (
	<div className={`container ${active && "grid"}`} 
		onDoubleClick={() => setActive(!active)}>
	 <Clock/>  
	 <TheSun />
	 <ToSearch />
	 <TheTree />
	 {/* <APIcard /> */}
	 <ToNavigate />
	 {/* <TestMeshScene /> */}
	 <LeafScene /> 
	 {/* <TreeScene /> temporarily commented */}
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

/* The code in this component needs to be cleaned it's 
so messy */
function ToSearch() {
	const [grow, setGrow] = useState(false);
	const [input, setInput] = useState("");
	const [visible, setVisible] = useState(false);
	const [clicked, setClicked] = useState(false);

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
			type="text" placeholder="Search" onClick={() => setClicked(!clicked)}/>}
			</button>   

		 {/*Placeholder part*/}
		<div className="P-container" style={{ width: grow && '0'}}>
			<p className="PHolder" style={{ display: grow && 'none'}}>
			Enter a city name</p></div>
			<ToNavigate grow={grow} clicked={clicked} /> {/*only one is enough*/}
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

// function TreeScene() {

//   return (
// 	<div className='h-fit w-full'> 
//     <Spline scene="https://prod.spline.design/k4HdtEjbBEFr3bSD/scene.splinecode" />
//   </div>
//   );

//   // we're gonna use .glb exporting way instead...

// } 

function Leaf() {
	const { scene } = useGLTF('/models/TreeScene.glb');
	const colorMap = useTexture('/textures/leaf2.jpg');

	useEffect(() => { 
		scene.traverse((child => {
		if(child.isMesh) {
			child.material = new THREE.MeshStandardMaterial({
				map: colorMap,
				roughness: 0.6,
				metalness: 0.1,
			})
		}
	}))

	}, [scene, colorMap]);

	return <primitive object={scene} scale={1.5} />
}
function LeafScene() {
	return(
		<Canvas camera={{ position: [0, 3, 6], fov: 50}}>
			<ambientLight intensity={1} />
			<directionalLight position={[6, 6, 6]} intensity={2} />
			<Leaf /> 
			<OrbitControls />
		</Canvas>
	)
}
 
// function TestMesh() {
// 	const texture = useTexture('/textures/leaf2.jpg');
	
// 	return (
// 		<mesh>
// 			<boxGeometry args={[3, 2, 2]} />
// 			<meshStandardMaterial roughness={2} 
// 			metalness={0.5} map={texture} color='white' />
// 		</mesh>
// 	);

// } // in RTF hooks like useGLTF and useTexture can only run inside components 
// that are children of <Canvas> otherwise you'll get an error, that's why we're using
// two components, one for the hooks and the other for the scene rendering

// function TestMeshScene() {
	
// 	return (
// 		<Canvas camera={{ position: [0, 3, 6], fov: 80}}>	
// 			<ambientLight intensity={3} />
// 			<directionalLight position={[2, 4, 6]} intensity={3} />
// 			<TestMesh />
// 			<OrbitControls /> 
// 		</Canvas>
	
// 	);
// }


// function APIcard() {
// 			// const [quote, setQuote] = useState(null); // belongs to API refrence 
// 			// const [next, setNext] = useState(false);
// 			const items = ['Cloudy', 'Rainy', 'Sunny', 'Snowy', 'Foggy', 'Windy'];
// 			const [index, setIndex] = useState(0);
// 			const [info, setInfo] = useState(null);


// 		const handleClick = () => {
// 		setIndex(Math.floor(Math.random() * items.length));
// 		}
		
// 		useEffect(() => {

// 	fetch('https://v2.jokeapi.dev/joke/Any')
// 		.then(res => res.json())
// 		.then(data => {
// 			setInfo(data);
// 		})
// 		.catch(err => {
// 			console.error('Sorry:', err);
// 		})		

// 		}, [])

// 		if(!info) return <p className='text-2xl ml-4'>Waiting...</p>

			
// 		return (
// 			<> 
// <div className="bg-[linear-gradient(to_left,#FFFFFF00_20%,#FFFFFF_45%)]
// 				opacity-80 rounded-2xl sm:rounded-3xl 
// 				text-center overflow-hidden w-full
// 				max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl
// 				h-20 sm:h-24 md:h-28 lg:h-32
// 				row-start-3 col-start-2 self-end justify-self-center
// 		 		px-4 sm:px-6 md:px-8 lg:px-10
// 		 		py-8 sm:py-10 md:py-12 lg:py-14
// 		 		shadow-lg sm:shadow-xl md:shadow-2xl
// 		 		hover:shadow-5xl
// 				flex justify-center">
//  	<p className="self-center my-4 sm:my-6 md:my-8 lg:my-y10 
// text-sm sm:text-base md:text-lg
// leading-relaxed sm:leading-loose">{info.joke}</p>
// </div> 				{/*Line height for readability*/}
// <p className='bg-gradient-to-r from-gray-50/100 from-20% to-gray-100/10 to-70% 
// text-center text-3xl row-start-4 rounded-2xl p-4
// self-center justify-self-center ml-14'
// onClick={handleClick}>{items[index]}</p> 
			
// 			</>
// 	);
// }

	function ToNavigate ({ grow, clicked }) {
				const navigate = useNavigate(); // to use navigate hook

				useEffect(() => {
					let naver;
				if(grow) {
				 if(clicked) {
					navigate('/');
				 }	
				   else {
					naver = setTimeout(() => {
					navigate('/result');
					}, 2000);
				   }
				}
				return () => clearTimeout(naver);
				}, [grow, clicked, navigate]);
		return null;
} 




//API Refrence modern way
/* useEffect(() => {
				// let switcher;	

			const fetchData = async () => {
					try {
			const res = await fetch("https://api.api-ninjas.com/v1/facts?limit=" + limit, {
				method: 'GET',
				headers: {
					'X-Api-Key': 'ubDKKf7I6bD1QdKa1xYrdg==qkR4uAnQAFKwNM7V',
					'Content-Type': 'application/json',
				},
					});
			
		    	const data = await res.json(); 
		    // switcher = setTimeout(() => {
		    //  setNext(prev => !prev);
			// 	 }, 10000);
					setQuote(data); // api returns the array, we take 
																	// first quote, second author
					} catch (err) {
						console.error(err);
					}
						
				};

				fetchData();
				// return () => clearTimeout(switcher);
			}, [quote]);

			if (quote) return <div className="flex justify-start items-center
				row-start-4"> 
				<p className="text-base sm:text-md md:text-lg 
					font-bold transition">Waiting...</p></div> */

//API Reference old-school clearer to me 
// useEffect(() => {
// 	const [quote, setQuote] = useState(null);

// 	fetch('https', {
// 		headers: {
// 			'x-Api-Key': 'my-API-Key',
// 			'content-type': 'my-content-type',
// 		}
// 	})
// 	.then(res => res.json())
// 	.then(data => {
// 		setQuote(data[0]);
// 	})
// 	.catch(err => {
// 		console.error('Error happened:', err);
// 	})
	
// }, []);

// if(!quote) return <div>Loading...</div>

// return(
// 	<div>
// 		<p>{quote.author}</p>
// 	</div>
// )



{/* 1. Remember to remove placeholder extra padding and add letter 
spacing and let the p delay a bit after it's visible again* /}


{/* here's the thing, for 1- the result page we only need a container
and 3 cards other colors and conditions we'll toggle them with 
conditional rendering and use API for the live data... 2- for the loading
page it's the same concept...*/} 
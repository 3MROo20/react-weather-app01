import React from 'react';
import { useState, useRef, useEffect, } from 'react';
import { useNavigate } from "react-router-dom";
import './index.css';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture, Box, Text3D, Center } from '@react-three/drei';



export default function SearchPage() {
	const [ active, setActive ] = useState(false);



	return (
	<div className={`container ${active && "grid"}`} 
		onDoubleClick={() => setActive(!active)}>
	 <Clock/>  
	 <TheSun />
	 <ToSearch />
	 <TheTree />
	 {/* <APIcard /> temporarily commented */}
	 <ToNavigate />
	 {/* <TestMeshScene /> */}
	 <TreeScene /> 
	 {/* <ThreedText /> temporarily commented  */}
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

/* The code in this component needs to be cleaned it's 
so messy */
function ToSearch() {
	const [grow, setGrow] = useState(false);
	const [input, setInput] = useState("");
	const [visible, setVisible] = useState(false);
	const [clicked, setClicked] = useState(false);

	const divRef = useRef(null);
	// const divWidth = divRef.current.style.width;
	const pRef = useRef(null);
	// const pIsRef = pRef.current; 

	function handleClick() {
 		setGrow(true);
 }

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
			}, 500);
		}
		return () => clearTimeout(toTime);
	}, [grow]); 


 const svg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
 	viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" 
 	strokeLinecap="round" strokeLinejoin="round"> 
<circle cx="11" cy="11" r="8"/> <line x1="23" y1="23" x2="16.65" y2="16.65"/>
 	 </svg>

	 return (
	 	<div className="barXplaceholder">
	 	 {/*SearchBar part*/}
		<button className="searchBtn" onClick={handleClick} style={{
		  width: grow && 'clamp(19rem, 13rem + 20vw, 25rem)',
		  transition: 'all 1.5s ease',
		}}>{svg} {grow && <input style={{opacity: visible ? "1" : "0"}} 
			value={input} onChange={(e) => setInput(e.target.value)} 
			type="text" placeholder="Search" onClick={() => setClicked(!clicked)}/>}
			</button>   

		 {/*Placeholder part*/}
		<div ref={divRef} className="PHolder" style={{ width: grow && '0'}}>
			<p ref={pRef} style={{ opacity: '1'}}>
			Enter a city name</p>
			 </div> 
			<ToNavigate grow={grow} clicked={clicked} /> 
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
			</>
			); 
}

function Tree() {
	const { scene } = useGLTF('/models/treescene.glb');
	const colorMap = useTexture('/textures/leaf2.jpg');

	useEffect(() => { 
		// traverse is like forEach but instead of mapping over an array items, it mapps 
		// over an object descendants (meshes), below, we assin a material to all meshes of Tree
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

	// primitives are used to integrate exisitng Three.js objects
	// commonly used with loaded 3D models like GLTF files
	return <primitive object={scene} scale={1.5} />
}
function TreeScene() {
	return(
		<div className='row-start-4 col-span-2 w-full'>
		<Canvas camera={{ position: [10, 14, 5], fov:50}}>
			<ambientLight intensity={1} />
			<directionalLight position={[6, 6, 6]} intensity={2} />
			<Tree /> 
			<OrbitControls />
		</Canvas>
		</div>
	)
}
 
// function ThreedText() {

// 	return (
// 		<Canvas camera={{ position: [1, 3, 4], fov: 50}}>
// 				<Text3D scale={[2, 2 , 2]} color='yellow'>
// 					Hello World
// 					<meshPhongMaterial />
// 				</Text3D>
// 			<ambientLight intensity={1.5}/>
// 			<directionalLight position={[1, 2, 2]} intensity={2}/>
// 			<OrbitControls />
// 		</Canvas>
// 	);
// }

// function TestMesh() {
// 	const texture = useTexture('/textures/leaf2.jpg');
	
// 	return (
// 		<mesh>
// 			<boxGeometry args={[3, 2, 2]} />  from React Three Fiber
// 			<meshStandardMaterial roughness={2} 
// 			metalness={0.5} map={texture} color='white' />
			// <Box></Box> from React Three drei
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
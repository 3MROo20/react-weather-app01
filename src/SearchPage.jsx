import React, { forwardRef, Suspense, use, useImperativeHandle, useLayoutEffect } from 'react';
import { useState, useRef, useEffect, } from 'react';
import { useNavigate } from "react-router-dom";
import './index.css';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import * as THREE from 'three';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture, Box, 
	  Text3D, Center, Environment, 
	  GradientTexture, 
	  MeshTransmissionMaterial,
	  MeshReflectorMaterial, shaderMaterial,
	  ContactShadows,
	  Loader,
	  Html,
	  useProgress,
	  Preload} from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import useSound from 'use-sound';
import { Howl, Howler } from 'howler';
import { create } from 'zustand';
	  gsap.registerPlugin(Flip);
import clouds from '/src/resultPageAssests/icons/distancedclouds.svg';
import cloudMain from '/src/resultPageAssests/icons/maincloud.svg';
import arrowDown from '/src/resultPageAssests/icons/arrow.svg';



export default function SearchPage() {
	const [ active, setActive ] = useState(false);


	return (
		<> 
		{/* SearchPage Background  */}
	<div className='Background relative'> 
		<div className="absolute min-h-screen inset-0 -z-10 blur-[2px] bg-cover bg-center 
		bg-no-repeat bg-[url(/src/resultPageAssests/images/MagicalCastle.jpg)]">
		  </div>
	</div>
	<div className='paddingContainer h-screen w-screen flex justify-center items-center'>
	<div className={`container ${active && "grid"}`} 
		onDoubleClick={() => setActive(!active)}>
	 <Clock/>  
	 <TheSun />
	 <ToSearch />
	 {/* <ToNavigate /> */}
	 <TreeScene /> 
	<BackgroundMusic />
	<Clouds /> 
	<Arrow />
	{/* <WeatherData /> */}
	</div>
	</div>    {/*paddingConatinaer*/}
		</>

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

    return () => clearInterval(timer); 
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

  return <div style={{animation: pulse &&  'pulse 15s ease 1'}} 
  	className="time">{formattedTime}</div>;
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
	  <img className="Sun" src="/src/suny-day.png"id="sun" 
	  style={{animation: rotate && 'rotate 15s linear infinite'}}/>
	);
}




/* The code in this component needs to be cleaned it's 
so messy */
function ToSearch() {
	const [grow, setGrow] = useState(false);
	const [visible, setVisible] = useState(false);

	// selectors style is recommended for performance and when there many components
	const setCity = useWeatherStore((s) => s.setCity);
	const fetchWeather = useWeatherStore((s) => s.fetchWeather);
	const city = useWeatherStore((s) => s.city);
	
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
 	 	}, 20000); 
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



		const handleKeyDown = async () => {
				setCity(city);
				
				await fetchWeather();
				navigate('/result');
		};



	 return (
	 	<div className="barXplaceholder">
	 	 {/*SearchBar part*/}
		<button className="searchBtn" onClick={handleClick} style={{
		  width: grow && 'clamp(19rem, 13rem + 20vw, 25rem)',
		  transition: 'all 1.5s ease',
		}}>{svg} {grow && <input style={{opacity: visible ? "1" : "0"}} 
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




function Tree() {
 
	const { scene } = useGLTF('/models/treescene.glb');	
	const treeRef = useRef();
	const progress = useAppStore((s) => s.progress);
	const globalClick = useAppStore((s) => s.globalClick);
	

	const leafMap = useTexture('/textures/leaves.jpg');
	const appleMap = useTexture('/textures/apple.jpg');
	const trunkMap = useTexture('/textures/tree2.jpg');
	const gtopMap = useTexture('/textures/terrain.jpg');
	const gbottomMap = useTexture('/textures/mud2.jpg');
	const backgroundAMap = useTexture('/textures/mud.jpg');
	const backgroundEMap = useTexture('/textures/mud2.jpg');
	const leafMap2 = useTexture('/textures/leaves2.jpg');
	
	{/* background Wrapping & Sharpness _main texture */}
	gtopMap.wrapS = gtopMap.wrapT = THREE.MirroredRepeatWrapping;
	gbottomMap.wrapS = gbottomMap.wrapT = THREE.ClampToEdgeWrapping;
	gtopMap.minFilter = THREE.LinearMipMapLinearFilter;
	gbottomMap.minFilter = THREE.LinearMipMapLinearFilter;
	gbottomMap.repeat.set(4, 4);

	{/* background Wrapping & Sharpness _normal and displacement maps */}
	backgroundAMap.wrapS = backgroundAMap.wrapT = THREE.MirroredRepeatWrapping;
	backgroundEMap.wrapS = backgroundEMap.wrapT = THREE.MirroredRepeatWrapping;

	{/* leaf Wrapping & Sharpness */}
	leafMap.wrapS = leafMap.wrapT = THREE.MirroredRepeatWrapping;
	leafMap.minFilter = THREE.LinearMipMapLinearFilter;

	useEffect(() => { 
		const apple02 = scene.getObjectByName('Sphere_2');
		const apple05 = scene.getObjectByName('Sphere_5');

		if(progress === 100 && globalClick && apple02) {
			gsap.to(apple02.position, {   // GSAP can't animate objects directly, it has to animate their .position or .rotation just like in camera example
				delay: 25,
				y: apple02.position.y -195,    // animating the y position...
				duration: 2.5, 
				ease: 'bounce',
			})
		}
		if(progress === 100 && globalClick && apple05) {
			gsap.to(apple05.position, {
				delay: 20,
				y: apple05.position.y -90,  
				duration: 2, 
				ease: 'bounce',
				
			})
		}

		// traverse is like forEach but instead of mapping over an array items, it mapps 
		// over an object descendants (meshes), below, we assin a material to all meshes of Tree
		scene.traverse((child => {
			if(child.isMesh) {
				switch(child.name) {
					case 'Trunk':
						child.material = new THREE.MeshStandardMaterial({
							map: trunkMap,
							roughness: 0.4,
							metalness: 0,
							color: '#AB7541',
						})  		
						break
						
			// lowering some materials to maintain performance 
		   case 'leaf':
			 child.material = new THREE.MeshStandardMaterial({
				 map: leafMap2,
				 color: '#90EE90',
				 roughness: 0.5,
				 metalness: 0.1,
				 transparent: true,
				 alphaTest: 0.5,
				 side: THREE.DoubleSide,

				})
			child.castShadow = true;
			break
			
			case 'ground_top':
			child.material = new THREE.MeshStandardMaterial({
				map: gtopMap,
				roughness: 0.8,
				metalness: 0.2,
				color: '#90EE90',

			})
			child.scale.z = 0.3;
			child.position.y = 0.5;
			child.receiveShadow = true;
			break 
			
			
			case 'ground_bottom':
				child.material = new THREE.MeshStandardMaterial({
				map: backgroundAMap,
				aoMap: gbottomMap,
				emissiveMap: backgroundEMap,
			})
			child.scale.z = -0.45;
			child.position.y = 0.5;
			break
		}	

				
	}
			if(child.name.startsWith('Sphere')) {
			child.material = new THREE.MeshStandardMaterial({
					map: appleMap,
					roughness: 0.4,
					metalness: 0.1,
					color: '#D20A2E',
					opacity: 0.5,
				}) 
			child.receiveShadow = true;
			child.castShadow = true;
			}

			
	}))
	}, [scene, leafMap, appleMap, trunkMap, gtopMap, gbottomMap, backgroundAMap,
		backgroundEMap, leafMap2, progress, globalClick]);
		
			
	return <primitive ref={treeRef} 
	object={scene} 
	scale={3} 
	position={[5.2, -4.2, 0]} 
	rotation={[0, -3.35, -0.045]} />

}




function CameraAnimation() {
	const { camera } = useThree();
	const progress = useAppStore((state) => state.progress);
	const globalClick = useAppStore((s) => s.globalClick);  

	useLayoutEffect(() => {
					if (progress === 100 && globalClick) {
						gsap.fromTo(camera.position, {
							x: -20, y: 15, z: 35,
						}, 
						{
							delay: 0.95,
							x: 0, y: 2, z: 15,
							duration: 12,  // duration also plays part in the syncing
							ease: 'power1.inOut',  // modified the ease for a better cinematic feeling
					})

					}
		}, [progress, globalClick]);
	}
	



	function TreeScene() {
		
		
	return (
		<>
			<div className='row-start-4 col-span-3 w-full h-[270px]'>
		<Canvas camera={{ position: [-20, 15, 35], fov:60, near:0.1, far:100}} 
		    shadows dpr={[1.5, 2]} onCreated={({ gl }) => {
		    const isMobile = window.innerWidth < 768;
			gl.shadowMap.enabled = !isMobile;
			gl.shadowMap.type = THREE.PCFSoftShadowMap;
			// for performance and optimization.. taking into consideration mobile devices
		}} 
		>
			<directionalLight color={'#FFE484'} position={[2, 8, 0]} intensity={1.5} castShadow
			shadow-mapSize-width={1024} shadow-mapSize-height={1024} 
			shadow-camera-near={0.5} shadow-camera-far={500} 
			shadow-camera-left={-10} shadow-camera-right={10}
			shadow-camera-top={10} shadow-camera-bottom={-10} shadow-color={'#FFE484'} />
				<ambientLight intensity={0.6}/>
			
			<LoadProgress />
			<Suspense fallback={<TextCard />}>
			<fogExp2 attach='fog' args={['#cce7ff', 0.023]} />
     		<Tree /> 	
            <Environment preset='sunset' resolution={256} />
			<Preload all />  {/*to preload all the assests in the background*/}
			</Suspense>
			<OrbitControls />
			<CameraAnimation />
		</Canvas>
		</div>
		</>
	
	);
}




	function LoadProgress() {
		const { progress } = useProgress();
		// Getting the action functions, so that we can update progress here in TreeScene
		const setProgress = useAppStore((state) => state.setProgress);

		useLayoutEffect(() => {
			// progress here is the progress of useProgress hook not AppStore progress
			setProgress(Math.floor(progress));

		}, [progress, setProgress]);

		return null;
			
	}



	function TextCard() {
			// Getting the value.. so we can read current progress (state.progress)
			const progress = useAppStore((state) => state.progress)

	return (
		<Html fullscreen>
			<div className='w-full h-fit flex justify-center'> 
		<div className='w-fit h-fit x-0 px-44 py-4 cardGradient border-8 border-gray-50/80 rounded-xl
		 font-poppins font-medium text-lg'>Loading... {Math.floor(progress)}%</div>
		 											{/*  reading the value */}
			</div>
		</Html>
	);
}





export const useAppStore = create((set) => ({   // creating a store (shared data bucket)
	count: 0,									// state
	increaseCount: () => set((state) => ({ count: state.count + 1})),     // action function 

	active: false,
	inactive: () => set((state) => ({ active: !state.active })),
	progress: 0,
	setProgress: (value) => set({ progress: value }),

	
	globalClick: false,
	hasTriggered: false,						// ensuring no duplication variable
	setGlobalClick: () => set((state) => {
		if(state.hasTriggered) return state;   // don't trigger process again
		return {
			globalClick: true,
			hasTriggered: true
		};
	}),
	city: '',
	setCity: (value) => set({ city: value }),
	fetch: false,
	setFetch: () => set((state) => ({ fetch: !state.fetch }))
	
}));




function BackgroundMusic() {
		// using the global count state from AppStore
		// const { count, increaseCount } = useAppStore();
		const globalClick = useAppStore((s) => s.globalClick);
		const progress = useAppStore((s) => s.progress);

		const btnSound = new Howl({
			
			src: ['/sounds/mainversion.mp3'],
			volume: 0.5,
			loop: false,
		}); 
		
		useEffect(() => {
			if (progress === 100 && globalClick) {
				btnSound.play();
			 }
		 }, [globalClick, progress])

}




	function Clouds() {
		 const progress = useAppStore((s) => s.progress);
		 const [ appear, setAppear ] = useState(false);
		 const globalClick = useAppStore((s) => s.globalClick);  // initiating globalClick button
		 const setGlobalClick = useAppStore((s) => s.setGlobalClick);

			useEffect(() => {
				// let t;
				if(progress === 100) { 
						setAppear(true);
				}
				if(progress === 100 && globalClick) {
					gsap.to('#clGroup', {  
						delay: 1,   // 0.1 difference from tree animation
						scale: 2.5,
						y: '1rem',
						x: '8rem', 
						opacity: 0,
						display: 'none',
						ease: 'sine.in', // same delay and slightly different ease = synced animation
						duration: 8,
					})
				}
				
				
				if(progress === 100 && globalClick) {
					gsap.to('#topCloud', {
						delay: 15, 
						x: '-37rem',
						ease: 'sine',
						duration: 30,
						repeat: -1, 
						yoyo: true
						
					})
					gsap.to('#bottomCloud', {
						delay: 18,
						x: '29rem', 
						ease: 'sine',
						duration: 30,
						repeat: -1, 
						yoyo: true
					})
				}
			}, [progress, globalClick]);
		 
		 return (
			<> 
			<div className='relative w-fill h-fit'>   
			     {/* Clouds group */}
				<img onClick={setGlobalClick} 
					className=
					{`absolute bottom-28 left-4 translate-x-16 translate-y-10
					 ${appear ? 'opacity-100' : 'opacity-0'} z-50 scale-100`}
				 src={clouds}
				 id='clGroup'/>
			</div> {/*top clooud*/}
				<img src={cloudMain}  
				className='absolute w-72 h-fit bottom-1/2 left-1/2 translate-x-[19rem] translate-y-[17rem]
				opacity-60 z-20'
				id='topCloud'/>
				<img className='absolute w-40 top-1/2 right-1/2 translate-x-[-19rem] translate-y-[23rem] 
				opacity-60 z-10'
				src={cloudMain}		  
				id='bottomCloud'/> 
				 {/*bottom cloud*/}
				</>

		 );
	}

	function Arrow() {
			const progress = useAppStore((s) => s.progress);
			const globalClick = useAppStore((s) => s.globalClick);
			const [ allowAnimate, setAllowAnimate ] = useState(false);
			const [ hasGuided, setHasGuided ] = useState(false);

			useEffect(() => {
				if(hasGuided) return 
				if(progress === 100 && !globalClick) {
					setAllowAnimate(true);
				}
				else if(globalClick) {
					setAllowAnimate(false);
					setHasGuided(true);
				} 
			}, [progress, globalClick]);

		return (
			<div className='relative w-full h-fit'>
				<img className={`absolute w-12 sm:w-8 md:w-16 bottom-[17rem] left-1/2 opacity-0 ${allowAnimate && 'animate-bounce opacity-100'}`}
				 src={arrowDown}/>
			</div>
		);
	}


export const useWeatherStore = create((set) => ({ 

	weather: null,  // to store the fetched data
	loading: false,		// conditioning loading phase
	error: null,			// to be assigned the error
	city: '',
	
	setCity: (city) => set({ city }),  // shorter way
	
	fetchWeather: async() => {
				// destructing style renders the whole store, it is for small and temproray states (not ideal for performance and when the app grows)
				const { city } = useWeatherStore.getState();    // to read the city state
				if(!city) return;

				set({ loading: true, error: null}) // data is about to be fetched

				try {																			
				// requesting data by city
				const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=cc57eb8ac62f4b53bfe154654251711&q=${city}&aqi=no`);

				if (!res.ok) throw new Error('city not found 😿');
				
				const data = await res.json();

				set({ weather: data, loading: false })
			} catch (err) {
				set({ error: err.message, loading: false })  // finish fetching data and assign it weather state
			}
		},
		

		//storing conditional layout data
	  layoutVariant: () => {
		// to access we first have to read it if the case is Zustand state
		const { weather } = useWeatherStore.getState();                     

		if(!weather) return 'default';

		const main = weather.current?.condition?.text.toLowerCase() || '';
		const temp = weather.current?.temp_c ?? 0;
	//weather state.main object{}.temp element no [0] because it's not an array

	// Description condition
		if(main.includes('rain')) return 'Rainy';
		if(main.includes('cloud')) return 'Cloudy';
		if(main.includes('sunny') || main.includes('clear')) return 'Clear Sky';
		if(main.includes('snow')) return 'Snowy';

		// temperature condition
		if(temp >= 30) return 'hot';
		if(temp >= 15) return 'mild';
		if(temp >= 7) return 'cold';
		if(temp < 7) return 'freezing';

		return 'default';
	}
}));
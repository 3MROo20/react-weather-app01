import React, { forwardRef, Suspense, use, useImperativeHandle } from 'react';
import { useState, useRef, useEffect, } from 'react';
import { useNavigate } from "react-router-dom";
import './index.css';
import gsap from 'gsap';
import * as THREE from 'three';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture, Box, 
	  Text3D, Center, Environment, 
	  GradientTexture, 
	  MeshTransmissionMaterial,
	  MeshReflectorMaterial, shaderMaterial,
	  ContactShadows,
	  Loader,
	  Html} from '@react-three/drei';



export default function SearchPage() {
	const [ active, setActive ] = useState(false);



	return (
	<div className={`container ${active && "grid"}`} 
		onDoubleClick={() => setActive(!active)}>
	 <Clock/>  
	 <TheSun />
	 <ToSearch />
	 {/* <TheTree /> b */}
	 {/* <APIcard /> temporarily commented */}
	 <ToNavigate />
	 {/* <TestMeshScene /> */}
	 <TreeScene /> 
	{/* <TextCard />*/}
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
	const pRef = useRef(null);

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
		<div className="PHolder" style={{ width: grow && '0'}}>
			<p ref={pRef} style={{ opacity: '1'}}>
			Enter a city name</p>
			 </div> 
			<ToNavigate grow={grow} clicked={clicked} /> 
		</div>
	); 
}

function Tree() {
 
	const { scene } = useGLTF('/models/treescene.glb');
	const treeRef = useRef();


	const leafMap = useTexture('/textures/leaves.jpg');
	const appleMap = useTexture('/textures/apple.jpg');
	const trunkMap = useTexture('/textures/tree2.jpg');
	const gtopMap = useTexture('/textures/terrain.jpg');
	const gbottomMap = useTexture('/textures/mud2.jpg');
	const backgroundAMap = useTexture('/textures/mud.jpg');
	const backgroundEMap = useTexture('/textures/mud2.jpg');
	// const topEMap = useTexture('/textures/terrain2.jpg');
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

		   case 'leaf':
			 child.material = new THREE.MeshPhysicalMaterial({
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
				child.material = new THREE.MeshPhysicalMaterial({
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
			child.material = new THREE.MeshPhysicalMaterial({
					map: appleMap,
					roughness: 0.5,
					metalness: 0.1,
					clearcoat: 0.5,
					clearcoatRoughness: 0.3, 
					color: '#D20A2E',
					opacity: 0.5,
				}) 
			child.castShadow = true;
			}


	}))
	}, [scene, leafMap, appleMap, trunkMap, gtopMap, gbottomMap, backgroundAMap,
		backgroundEMap, leafMap2]);

		useEffect(() => { {/* will refine the animation later */}
			const tl = gsap.timeline({onComplete: TreeScene, delay: 0.5, ease: 'backIn'});
					if (!treeRef.current) return
						tl.fromTo(treeRef.current.position, {
							x: 1.5, y: -0.5, z: 0,
							duration: 1,
						}, 
					{
						x: 5.2, y: -4.2, z: 0,
					})

					if (!treeRef.current) return
						tl.fromTo(treeRef.current.rotation, {
							x: 0, y: -3.00, z: -0.045,
							duration: 1,
						}, 
					{
						x: 0, y: -3.35, z: -0.045,	
					})
					
					// scale={2.5} position={[1.5, 0, 0]} rotation={[0, -2.60, -0.045]

					if (!treeRef.current) return
						tl.fromTo(treeRef.current.scale, {
							x: 2.5, y: 2.5, z: 2.5,	
							duration: 1,
						}, 
					{
						x: 3, y: 3, z: 3,
					})
					}, [treeRef])

	
	// onReady is active when the scene is apparent 
// 	const _ready = useRef(false);
// 	useEffect(() => {
// 		if (scene && !_ready.current) {
// 			_ready.current = true;
// 		if(typeof onReady === 'function') onReady();
// 	}
// }, [scene, onReady]);

	// primitives are used to integrate existing Three.js objects
	// commonly used with loaded 3D models like GLTF files
	return <primitive ref={treeRef} object={scene} scale={3} position={[5.2, -4.2, 0]} rotation={[0, -3.35, -0.045]} />
	{/* here I noticed that I can animate the rotation of y axis instead of the camera it will give the exact movement that I want */}
	{/* from rotatoin {0, -3.00, -0.045} to rotation={[0, -3.35, -0.045]} I can even animate the z rotation too
		for a cinematic intro*/}

}

function TreeScene() {
	// const [loaded, setLoaded] = useState(false);

	return (
		<>
			<div className='row-start-4 col-span-3 w-full h-[270px]'>
		<Canvas camera={{ position: [0, 2, 15], fov:60, near:0.1, far:100}} 
		shadows dpr={[1, 2]} gl={{ shadowMapType: THREE.PCFSoftShadowMap }}
		>
			<directionalLight color={'#FFE484'} position={[2, 8, 0]} intensity={0.8} castShadow
			shadow-mapSize-width={1024} shadow-mapSize-height={1024} 
			shadow-camera-near={0.5} shadow-camera-far={500} 
			shadow-camera-left={-10} shadow-camera-right={10}
			shadow-camera-top={10} shadow-camera-bottom={-10} shadow-color={'#FFE484'} />
				<ambientLight intensity={0.5}/>
				<hemisphereLight intensity={0.3}  skyColor={'#FFE484'} groundColor={'#743E0C'} />
			<Suspense fallback={<TextCard />}>
     		<Tree /> 	
			</Suspense>
			<OrbitControls />
			<Environment preset='sunset' /> 
		</Canvas>
		</div>
		{/* {!loaded && <TextCard />} */}
		</>
	
	);
}

// will be done in animation stage later
function TextCard() {
		// const animateRef = useRef();
	 
	//  animateRef.current.position maybe like this
	//  useEffect(() => {
	// 	if(!animateRef.current) return
	// 	   gsap.to(animateRef.current, {  
	// 		// from-indigo-50 from-30% via-gray-50/30 via-60% to-gray-50/0 to-85%
	// 		backgroundImage: 'linear-gradient()',
	// 		ease: 'circ.inOut',
	// 		duration: 3,
	// 		repeat: -1,
	// 		yoyo: true,
	// 	})

	//    }, [animateRef])

	return (
		<Html fullscreen>
			<div className='w-full h-fit flex justify-center'> 
		<div className='w-fit h-fit x-0 px-44 py-4 cardGradient rounded-xl
		 font-poppins font-medium text-lg'>Loading...</div>
			</div>
		</Html>
	);
}

// temporarily commented, will be done in animation stage
// function CameraAnimation() {
// 		const { camera } = useThree();

// 		useEffect(() => {
// 			const radiusX = 5;
// 			const radiusZ = 3;

// 			gsap.to(camera.position, {
// 				duration: '2',
// 				ease: 'back.inOut',
// 				onUpdate: () => {
// 					const tl = gsap.timeline().time()
// 					camera.position.x = Math.cos( tl * 0.3) * radiusX
// 					camera.position.z = Math.sin(tl * 0.3) * radiusZ
// 					camera.lookAt(0, 0, 0);
// 				},
// 			})

// 		}, [camera]);

// 		return null;
// }



	function ToNavigate ({ grow , clicked }) {
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
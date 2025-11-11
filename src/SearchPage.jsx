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
	  Html} from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import useSound from 'use-sound';
	  gsap.registerPlugin(Flip);



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
	{/* <TestCard /> */}
	<BackgroundMusic />
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
			<p ref={pRef} style={{ opacity: '1', translateX: '0'}}>
			Enter a city name</p>
			 </div> 
			<ToNavigate grow={grow} clicked={clicked} /> 
		</div>
	); 
}

function Tree() {
 
	const { scene } = useGLTF('/models/treescene.glb');
	const treeRef = useRef();
	// const [ jumped, setJumped ] = useState(false);
	
	
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
		// scene.background = new THREE.Color('#cce7ff');
		// scene.fog = new THREE.Fog('#cce7ff', 5, 20);

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


			// return () => {
			// 	scene.fog = null;
			// }
	}))
	}, [scene, leafMap, appleMap, trunkMap, gtopMap, gbottomMap, backgroundAMap,
		backgroundEMap, leafMap2]);

		useLayoutEffect(() => {
			// const tl = gsap.timeline({onComplete: TreeScene, delay: 0.5, ease: 'expo.in' });
			// 		if (!treeRef.current) return
			// 			tl.fromTo(treeRef.current.position, {
			// 				x: 1.5, y: -0.5, z: 0,
			// 			}, 
			// 			{
			// 				x: 5.2, y: -4.2, z: 0,
			// 				duration: 2.5,
			// 		})

			// 		if (!treeRef.current) return
			// 			tl.fromTo(treeRef.current.rotation, {
			// 				x: 0, y: -3.00, z: -0.045,
			// 			}, 
			// 		{
			// 			x: 0, y: -3.35, z: -0.045,	
			// 			duration: 4.5,
			// 		}, '<'
			// );
					
			// 		if (!treeRef.current) return
			// 			tl.fromTo(treeRef.current.scale, {
			// 				x: 2.55, y: 2.55, z: 2.55,	
			// 			}, 
			// 		{
			// 				x: 3, y: 3, z: 3,
			// 				duration: 6,
			// 			}, 
			// '<')
						
						// ease: 'power4',  // the more the power the more dramatic and slow easing becomes
										// and so vice versa
			//   return () => tl.kill();
			}, []);

		// useGSAP(() => {

		// 		const state = Flip.getState(treeRef.current, {
		// 			props: 'position,rotation,scale',
		// 			simple: true     // for optimization 
		// 		});
				
		// 		setJumped(prev => !prev);
				
		// 		requestAnimationFrame(() => {
					
		// 			Flip.from(state, {duration: 15, 
		// 				ease: 'back.inOut',
		// 				three: true   // crucial for 3D support
		// 			})
		// 		})
		
		// }, [treeRef]) Flip with 3D is a bit tricky, commenting it for now
		
			
	return <primitive ref={treeRef} 
	object={scene} 
	scale={3} 
	position={[5.2, -4.2, 0]} 
	rotation={[0, -3.35, -0.045]} />

}

function CameraAnimation() {
	const { camera } = useThree();

	useLayoutEffect(() => {
						gsap.fromTo(camera.position, {
							x: -20, y: 15, z: 33,
						}, 
						{
							x: 0, y: 2, z: 15,
							delay: 1.5,
							duration: 8,
							ease: 'sine.inOut',
							// onUpdate: () => {
							// 	camera.lookAt();
							// },
					})
		}, []);
}

function TreeScene() {

	return (
		<>
			<div className='row-start-4 col-span-3 w-full h-[270px]'>
		<Canvas camera={{ position: [0, 2, 15], fov:60, near:0.1, far:100}} 
		shadows dpr={[1, 1.5]} onCreated={({ gl }) => {
			const isMobile = window.innerWidth < 768;
			gl.shadowMap.enabled = isMobile;
			gl.shadowMap.type = THREE.PCFSoftShadowMap;
			// for performance and optimization.. taking into consideration mobile devices
		}}
		>
			<directionalLight color={'#FFE484'} position={[2, 8, 0]} intensity={0.8} castShadow
			shadow-mapSize-width={1024} shadow-mapSize-height={1024} 
			shadow-camera-near={0.5} shadow-camera-far={500} 
			shadow-camera-left={-10} shadow-camera-right={10}
			shadow-camera-top={10} shadow-camera-bottom={-10} shadow-color={'#FFE484'} />
				<ambientLight intensity={0.5}/>
			<Suspense fallback={<TextCard />}>
			<fogExp2 attach='fog' args={['#cce7ff', 0.025]} />
			{/* <color attach='background' args={['#588157']}/> */}
     		<Tree /> 	
			</Suspense>
			<OrbitControls />
			<Environment preset='sunset' resolution={256} /> 
			<CameraAnimation />
		</Canvas>
		</div>
		</>
	
	);
}

{/* // will be done in animation stage later */}
function TextCard() {
	    const grRef = useRef();

		// useGSAP(() => {

		// 	// useGSAP does the same work as gsap.context
		// 	const ctx = gsap.context(() => {
		// 		gsap.fromTo(grRef.current, {
		// 					background: 'linear-gradient(to right, #eef2ff 10%, #eef2ff40 0%, #eef2ff20 90%)',
		// 					ease: 'power4.inOut',
		// 					duration: 6,
		// 					repeat: -1,
		// 					yoyo: true
		// 				}, 
		// 				{
		// 					background: 'linear-gradient(to right, #eef2ff 100%, #eef2ff40 0%, #eef2ff20 90%)',
		// 					ease: 'power4.inOut',
		// 					duration: 6,
		// 					repeat: -1,
		// 					yoyo: true
		// 			});
		// 	}, grRef.current);
		// 	return () => ctx.revert();    // for clean up
		// }, []);

	return (
		<Html fullscreen>
			<div ref={grRef} className='w-full h-fit flex justify-center'> 
		<div className='w-fit h-fit x-0 px-44 py-4 cardGradient rounded-xl
		 font-poppins font-medium text-lg'>Loading...</div>
			</div>
		</Html>
	);
}

function BackgroundMusic() {
		const [playBg] = useSound('/sounds.MainVersion.mp3', { 
			volume: 2, loop: true
		});

		function handleClick() {
			playBg();
		}

		// howler library is for more advanced stuff, and stuff that require more control, like
		// games and advanced 3D website etc anyway must give it a try later

		// import { Howl } from 'howler';
		// const btnSound = new Howl({
		// 	src: ['/sounds/btn/.mp3'],
		// 	volume: 0.7,
		// 	loop: false
		// });
		// btnSound.play();

	//  return (
	// 	// <button onClick={handleClick}>Start journey</button>
	//  );
}

{/* // music name: poem of the wind
function TestCard() {
		// const [ gradient, setGradient ] = useState(false);
		const grRef = useRef();

		useGSAP(() => {
			// const state = Flip.getState(grRef.current, { 
			// 	props: 'opacity,backgroundColor,transform,backgroundImage',
			// })

			// setGradient(prev => !prev);
			
			// // needs to delay Flip a bit so that React gets to update the DOM
			// // without this, the DOM never gets updated thus there's no change; Flip doesn't
			// // know what to actually measure.
			// requestAnimationFrame(() => { or useLayoutEffect(() => {});
			// 	Flip.from(state, {
			// 		ease: 'power4',
			// 		duration: 1.5,
			// 		repeat: -1,
			// 		yoyo: true,
			// 		onRepeat: () => setGradient(prev => !prev),
			// 	});
			// });

			gsap.fromTo(grRef.current, {
				background: 'linear-gradient(to right, #eef2ff 10%, #eef2ff40 0%, #eef2ff20 90%)',
				ease: 'power4.inOut',
				duration: 10,
				repeat: -1,
				yoyo: true
			}, 
			{
				background: 'linear-gradient(to right, #eef2ff 100%, #eef2ff40 0%, #eef2ff20 90%)',
				ease: 'power4.inOut',
				duration: 10,
				repeat: -1,
				yoyo: true
		});

		}, [grRef]);

	return (
		<div 
		className='card h-fit x-0 px-44 py-4 cardGradient rounded-xl
		flex justify-center row-4 col-span-3'>
		<p className='font-poppins font-medium text-lg'>Loading...</p>
	</div>		

	);
} */}


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
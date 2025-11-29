import React, { Suspense, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Html, Preload, PerformanceMonitor, OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useAppStore } from './stores';
import CameraAnimation from './CameraAnimation';




function Tree() {
  const { scene } = useGLTF('/models/treescene.glb');
  const treeRef = useRef();
  const originalApplePositions = useRef({});

  // App state selectors
  const progress = useAppStore((s) => s.progress);
  const globalClick = useAppStore((s) => s.globalClick);
  const hasApplesFallen = useAppStore((s) => s.hasApplesFallen);
  const setHasApplesFallen = useAppStore((s) => s.setHasApplesFallen);
  const hasVisitedSearchPage = useAppStore((s) => s.hasVisitedSearchPage);
  const three = useThree();
  const invalidate = three?.invalidate;   // for manual frame invalidation since we're using frameloop='demand'
  const hasPlayed = useAppStore((s) => s.hasPlayed);

  
  // Loading textures
  const leafMap2 = useTexture('/textures/leaves2.jpg');
  const appleMap = useTexture('/textures/apple.jpg');
  const trunkMap = useTexture('/textures/tree2.jpg');
  const gtopMap = useTexture('/textures/terrain.jpg');
  const gbottomMap = useTexture('/textures/mud2.jpg');
  const backgroundAMap = useTexture('/textures/mud.jpg');
  const backgroundEMap = useTexture('/textures/mud2.jpg');



  // small texture tuning
  useEffect(() => {
    if (!gtopMap || !gbottomMap) return;
    gtopMap.wrapS = gtopMap.wrapT = THREE.MirroredRepeatWrapping;
    gbottomMap.wrapS = gbottomMap.wrapT = THREE.ClampToEdgeWrapping;
    gtopMap.minFilter = THREE.LinearMipMapLinearFilter;
    gbottomMap.minFilter = THREE.LinearMipMapLinearFilter;
    gbottomMap.repeat.set(4, 4);

    if (leafMap2) {
      leafMap2.wrapS = leafMap2.wrapT = THREE.MirroredRepeatWrapping;
      leafMap2.minFilter = THREE.LinearMipMapLinearFilter;
    }

    if (backgroundAMap && backgroundEMap) {
      backgroundAMap.wrapS = backgroundAMap.wrapT = THREE.MirroredRepeatWrapping;
      backgroundEMap.wrapS = backgroundEMap.wrapT = THREE.MirroredRepeatWrapping;
    }
  }, [gtopMap, gbottomMap, leafMap2, backgroundAMap, backgroundEMap]);




  // Apple fall —> run once when conditions met
  useEffect(() => {
    // Reset hasApplesFallen when conditions are not met (match camera/clouds flow)
    if (!globalClick || progress < 100) {
      setHasApplesFallen(false);
      return;
    }

    if (!scene || hasApplesFallen || hasVisitedSearchPage) return;

    const apple02 = scene.getObjectByName('Sphere_2');
    const apple05 = scene.getObjectByName('Sphere_5');
    if (!apple02 && !apple05) return; // wait until apples exist



    // Apples Falling Animation Part**
    // wait two frames so scene painted initial positions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const activeTweens = [];

        if (apple05) {
          const t1 = gsap.to(apple05.position, {
            delay: 25,
            y: apple05.position.y - 90,
            duration: 2,
            ease: 'bounce.out',
            onUpdate: () => {
              if (invalidate) invalidate();
            },
          });
          activeTweens.push(t1);
        }



        if (apple02) {
          const t2 = gsap.to(apple02.position, {
            delay: 22,
            y: apple02.position.y - 195,
            duration: 2.2,
            ease: 'bounce.out',
            onUpdate: () => {
              if (invalidate) invalidate();
            },
          });
          activeTweens.push(t2);
        }

        setHasApplesFallen(true);
        // cleanup function if component unmounts
        return () => activeTweens.forEach((t) => t.kill && t.kill());
      });
    });
  }, [scene, progress, globalClick, invalidate, hasPlayed, hasApplesFallen, setHasApplesFallen, hasVisitedSearchPage]);





  // Animation reset Part**
  // Reset apple positions when animation flag is reset (to match camera/clouds flow)
  // this approach wasn't wrorking so we replaced it with toggoling hasVisitedSearchPage state -> to be cleaned
  useEffect(() => {
    if (!scene || hasApplesFallen) return;

    const apple02 = scene.getObjectByName('Sphere_2');
    const apple05 = scene.getObjectByName('Sphere_5');

    // Reset apples to their stored original positions
    if (apple02 && originalApplePositions.current['Sphere_2']) {
      apple02.position.copy(originalApplePositions.current['Sphere_2']);
    }
    if (apple05 && originalApplePositions.current['Sphere_5']) {
      apple05.position.copy(originalApplePositions.current['Sphere_5']);
    }

    if (invalidate) invalidate();
  }, [scene, hasApplesFallen, invalidate]);




  // Assigning materials Part**
  // Assigning materials once (safe: runs when scene & textures are ready)
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (!child.isMesh) return;

      // Store original apple positions (to match camera/clouds flow)
      if (child.name === 'Sphere_2' || child.name === 'Sphere_5') {
        if (!originalApplePositions.current[child.name]) {
          originalApplePositions.current[child.name] = child.position.clone();
        }
      }

      // small name-based material assignment
      if (child.name === 'Trunk') {
        child.material = new THREE.MeshStandardMaterial({ map: trunkMap, roughness: 0.4, metalness: 0, color: '#AB7541' });
      } else if (child.name === 'leaf') {
        child.material = new THREE.MeshStandardMaterial({
          map: leafMap2,
          color: '#90EE90',
          roughness: 0.5,
          metalness: 0.1,
          transparent: true,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
        });
        child.castShadow = true;
      } else if (child.name === 'ground_top') {
        child.material = new THREE.MeshStandardMaterial({ map: gtopMap, roughness: 0.8, metalness: 0.2, color: '#90EE90' });
        child.scale.z = 0.3;
        child.position.y = 0.5;
        child.receiveShadow = true;
      } else if (child.name === 'ground_bottom') {
        child.material = new THREE.MeshStandardMaterial({ map: backgroundAMap, aoMap: gbottomMap, emissiveMap: backgroundEMap });
        child.scale.z = -0.45;
        child.position.y = 0.5;
      }

      if (child.name && child.name.startsWith('Sphere')) {
        child.material = new THREE.MeshStandardMaterial({ map: appleMap, roughness: 0.4, metalness: 0.1, color: '#D20A2E', opacity: 0.5 });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, leafMap2, appleMap, trunkMap, gtopMap, gbottomMap, backgroundAMap, backgroundEMap]);





  // Responsive tree transform part**
  const [treePos, setTreePos] = useState([5.2, -4.2, 0]);
  const [treeRot, setTreeRot] = useState([0, -3.2, -0.005]);
  const [treeScale, setTreeScale] = useState(3);

  useEffect(() => {
    const updateTree = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setTreePos([0, -3, 2.5]);
        setTreeRot([0, -3.35, -0.015]);
        setTreeScale(3.5);
      } else if (w < 1024) {
        setTreePos([0, -3, 2.5]);
        setTreeRot([0, -3.35, -0.01]);
        setTreeScale(3.5);
      } else {
        setTreePos([0, -3, 2.5]);
        setTreeRot([0, -3.35, -0.005]);
        setTreeScale(3.6);
      }
    };
    updateTree();
    window.addEventListener('resize', updateTree);
    return () => window.removeEventListener('resize', updateTree);
  }, []);

  return <primitive ref={treeRef} object={scene} scale={treeScale} position={treePos} rotation={treeRot} />;
}


// Main TreeScene Component**
export default function TreeScene() {
  const cameraPos = useAppStore((s) => s.cameraPos);


  return (
    <div className='row-start-4 col-span-3 self-end w-full h-[190px] sm:h-[150px] md:h-[190px] lg:h-[200px]'>
      <Canvas
        frameloop='demand'
        camera={{ position: cameraPos, fov: 100, near: 0.1, far: 100 }}
        shadows
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          const isMobile = window.innerWidth < 768;
          gl.shadowMap.enabled = !isMobile;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* lights */}
        <directionalLight
          color={'#FFE484'}
          position={[2, 8, 0]}
          intensity={3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-color={'#FFE484'}
		  />
        <ambientLight intensity={1.5} />
		
		  <Suspense fallback={<TextCard />}>
          <Tree />
		</Suspense>
		<LoadProgress />
        <PerformanceMonitor onDecline={() => console.log('Device is struggling - lowering DPR')} />
        <Preload all />
        <fogExp2 attach='fog' args={['#cce7ff', 0.033]} />
		<CameraAnimation />
        <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  );
}



// Load Progress Component**
function LoadProgress() {
  const { progress } = useProgress();
  const setProgress = useAppStore((s) => s.setProgress);

  // useEffect (not useLayoutEffect) -> avoids render-time state update warnings
  useEffect(() => {
    setProgress(Math.floor(progress));
  }, [progress, setProgress]);

  return null;
}




// Loading Text Card Component**
function TextCard() {

  return (
    <Html fullscreen>
      <div className='w-full col-span-1/4 h-fit flex justify-center items-center mt-8 sm:mt-6 md:mt-12'>
        <div className='w-fit h-fit x-0 px-10 sm:px-6 md:px-26 lg:px-36 py-3 md:py- ml-2 sm:ml-4 md:ml-0 cardGradient border-8 border-gray-50/80 rounded-xl
		font-poppins font-medium text-lg sm:text-[1rem] flex justify-between items-center gap-2 md:gap-4'> Loading ...
		<div className='size-5 sm:size-3 md:size-6 justify-self-start border border-solid border-gray-900 border-t-transparent rounded-full animate-spin'></div>
		</div>
		</div>
    </Html>
  );
}

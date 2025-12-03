import React from 'react';
import { useState, useRef, useEffect, } from 'react';
import './index.css';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { Howl } from 'howler';
	  gsap.registerPlugin(Flip);
import clouds from '/assets/icons/distancedClouds.svg';
import cloudMain from '/assets/icons/maincloud.svg';
import arrowDown from '/assets/icons/arrow.svg';
import ToSearch from './ToSearch';
import TreeSceneLazy from './TreeSceneLazy';
import SunnyDay from '/assets/icons/sunnyDay.svg';
import { useAppStore } from './stores';



// Main SearchPage Component**
export default function SearchPage() {


  // App Store selectors
	const progress = useAppStore((s) => s.progress);
	const globalClick = useAppStore((s) => s.globalClick);
	const resetGlobalClick = useAppStore((s) => s.resetGlobalClick);
	const setHasCloudsAnimated = useAppStore((s) => s.setHasCloudsAnimated);
	const setHasCameraAnimated = useAppStore((s) => s.setHasCameraAnimated);
	const setHasApplesFallen = useAppStore((s) => s.setHasApplesFallen);


	useEffect(() => {
		// Reseting animation flags when navigating back to SearchPage
		// to ensure animations don't replay automatically
		if (progress >= 100) {
			resetGlobalClick();
			setHasCloudsAnimated(false);
			setHasCameraAnimated(false);
			setHasApplesFallen(false);
      // hasApplesFallen is not needed currently...
		}
	}, [progress, resetGlobalClick, setHasCloudsAnimated, setHasCameraAnimated, setHasApplesFallen]);



	return (
		<>
		{/* SearchPage Background  */}
	<div className='Background relative'>
		<div className="absolute min-h-screen inset-0 -z-10 blur-[2px] bg-cover bg-center
		bg-no-repeat bg-[url(/assets/images/MagicalCastle.jpg)]">
		  </div>
	</div>
	<div className='container'>
	 <Clock/>
	 <TheSun />
	 <ToSearch />
	 <TreeSceneLazy />
	<BackgroundMusic />
	<Clouds />
	<Arrow />
	</div>
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
		return () => clearTimeout(rotater);
	}, []);

	return (
	  <img className="Sun" src={SunnyDay} id="sun"
	  style={{animation: rotate && 'rotate 15s linear infinite'}}/>
	);
}







function BackgroundMusic() {
    const globalClick = useAppStore((s) => s.globalClick);
    const progress = useAppStore((s) => s.progress);
    const hasPlayed = useAppStore((s) => s.hasPlayed);
    const setHasPlayed = useAppStore((s) => s.setHasPlayed);

    const soundRef = useRef(null);

    useEffect(() => {
        const sound = new Howl({
            src: ["/sounds/mainversion.mp3"],
            volume: 0.5,
            loop: false,
        });

        soundRef.current = sound;

        return () => {
            // Fade out when leaving scene instead of stopping instantly
            if (soundRef.current && soundRef.current.playing()) {
                soundRef.current.fade(0.5, 0, 30000);
                setTimeout(() => soundRef.current.stop(), 30000);
            }
        };
    }, []);

    // Only play ONCE after user click → never replay unless click happens again
    useEffect(() => {
        if (!soundRef.current) return;

        // Conditions to play
        const shouldPlay =
            globalClick &&
            progress === 100 &&
            !hasPlayed;

        if (shouldPlay) {
            soundRef.current.play();
            setHasPlayed(true);
        }
		else if(!globalClick || progress < 100) {
			// Reset hasPlayed if conditions are not met
			setHasPlayed(false);
		}
    }, [globalClick, progress, hasPlayed]);

    return null;
}





  function Clouds() {
  const progress = useAppStore((s) => s.progress);
  const globalClick = useAppStore((s) => s.globalClick);
  const setGlobalClick = useAppStore((s) => s.setGlobalClick);
  const hasCloudsAnimated = useAppStore((s) => s.hasCloudsAnimated);
  const setHasCloudsAnimated = useAppStore((s) => s.setHasCloudsAnimated);

  const [appear, setAppear] = useState(false);
  const appearedRef = useRef(false);


  useEffect(() => {
    if (progress >= 100 && !appearedRef.current) {
      // small delay to ensure loader unmounts cleanly
      const t = setTimeout(() => {
        setAppear(true);
        appearedRef.current = true;
      }, 220);
      return () => clearTimeout(t);
    }
  }, [progress]);

  useEffect(() => {
    // Reset hasCloudsAnimated when conditions are not met
    if (!globalClick || progress < 100) {
      setHasCloudsAnimated(false);
      return;
    }

    // Only animate once per globalClick cycle
    if (progress >= 100 && globalClick && !hasCloudsAnimated) {
      // animate cloud group fade/scale out
      gsap.to('#clGroup', {
        delay: 1,
        scale: 2,
        opacity: 0,
        display: 'none',
        ease: 'sine.in',
        duration: 8,
      });

      gsap.to('#topCloud', { delay: 15, x: '-37rem', ease: 'sine', duration: 30, repeat: -1, yoyo: true });
      gsap.to('#bottomCloud', { delay: 18, x: '29rem', ease: 'sine', duration: 30, repeat: -1, yoyo: true });

      setHasCloudsAnimated(true);
    }
  }, [progress, globalClick, hasCloudsAnimated, setHasCloudsAnimated]);

  return (
    <>
      <div className='relative w-full h-fit'>
        <img
          onClick={() => setGlobalClick(true)}
          className={`absolute bottom-[3rem] sm:bottom-[1.5rem] md:bottom-[4.2rem] lg:bottom-[4rem] 
					right-24 sm:right-12 md:left-20 lg:left-[4.5rem] translate-x-full md:translate-x-16 lg:translate-x-20 translate-y-10 
					size-60 sm:size-48 md:size-64 lg:size-72
					transition-opacity duration-2000 ease-in
					 ${appear ? 'opacity-100' : 'opacity-0'} z-50 scale-100`}
          src={clouds}
          id='clGroup'
        />
      </div>
		{/*top cloud*/}
	  <img src={cloudMain}  
				className='absolute w-48 sm:w-40 md:w-64 lg:w-72 h-fit bottom-[55%] md:bottom-1/2 left-1/2 translate-x-[19rem] translate-y-[17rem] md:translate-y-[18rem]
				opacity-60 z-20'
				id='topCloud'/>
	  <img className='absolute w-32 sm:w-30 md:w-40 top-1/2 md:top-[50%] right-1/2 translate-x-[-19rem] translate-y-[18rem] md:translate-y-[19.5rem]
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

  const [allowAnimate, setAllowAnimate] = useState(false);
  const [hasGuided, setHasGuided] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current) return;
    if (progress >= 100 && !globalClick) {
      const t = setTimeout(() => {
        setAllowAnimate(true);
      }, 180);
      return () => clearTimeout(t);
    }
    if (globalClick && !hasGuided) {
      setAllowAnimate(false);
      setHasGuided(true);
      triggeredRef.current = true;
    }
  }, [progress, globalClick, hasGuided]);

  return (
	<div className='relative w-full h-fit'>
				<img className={`absolute w-12 sm:w-8 md:w-14 lg:w-[3.8rem] bottom-[11rem] sm:bottom-[7.5rem] md:bottom-[13rem] lg:bottom-[14.2rem]
				 right-[80%] sm:left-[10%] md:left-[40%] lg:left-[40%]
				 opacity-0 ${allowAnimate && 'animate-bounce opacity-100'}`}
				 src={arrowDown}/>
	</div>

  );
}







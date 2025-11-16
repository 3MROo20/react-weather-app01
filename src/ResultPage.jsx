import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sunIcon from './resultPageAssests/icons/theSun.svg';
import windIcon from './resultPageAssests/icons/Wind.svg';
import humidityIcon from './resultPageAssests/icons/humidity_percentage.svg';
import skyScrapper from './resultPageAssests/icons/skyscraper.svg';
import './index.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import SplitType from 'split-type';
    gsap.registerPlugin(Flip, useGSAP);


export default function ResultPage() {
	const [ nav, setNav ] = useState(false);
	const navigate = useNavigate();
	
	if(nav) {
	 navigate('/');
	}

	return (
    <> 
    <div className='relative'>
        <div className='absolute bg-[url(src/resultPageAssests/images/MagicalCastle.jpg)]
     	 -z-10 bg-center bg-no-repeat bg-cover blur-[2px] inset-0 min-h-screen'>
        </div>
    </div>
     <div className='not-italic minax bg-gray-50/30 w-2/3 m-auto max-w-[35rem]
         h-fit rounded-md sm:rounded-lg md:xl lg:rounded-2xl bg-cover -z-10
         p-6 sm:p-4 md:p-8 lg:p-10'> 
     <div className="flex flex-col flex-wrap gap-4 justify-center items-center">
       <button className='w-12 h-6 self-end' onClick={() => 
		setNav(!nav)}>back</button> 
	<TempCard />
	<StatusCard />
	<TimeCard />
	</div>
     </div>
    </>

		
		);
}

function TempCard() {
    const mainRef = useRef(null);

    useGSAP(() => {

        // const rise = new SplitType('#arise', {
        //     types: 'words, chars, lines',
        // });
        // const slide = new SplitType('#feels', {
        //        types: 'words, chars',
        // });

        // gsap.from(slide.words, {
        //      y: 20,
        //      opacity: 0,
        //      duration: 1.5,
        //      ease: 'expo.inOut',
        //      stagger: 1,
        //      delay: 1.5,
        // });
        gsap.from('#MainCard', {
            y: -80,
            opacity: 0,
            ease: 'bounce.out',
            duration: 1,
            absolute: true,
            delay: 0.35
        });

        gsap.from('#arise', {
            y: -15,
            opacity: 0,
            duration: 1,
            ease: 'power3.in',
            delay: 1.2
        });


        {/* Feels like part */}
        gsap.from('#feels', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.inOut',
            delay: 3.5,
        });

        {/*Lowest Highest part*/}
        const lowhigh = new SplitType('#lowhigh', {type: 'words'})
        gsap.from(lowhigh.words, {
            opacity: 0,
            x: -20, 
            duration: 1.5,
            ease: 'sine.out',
            delay: 5,
        }); 

    }, []) /*for cleanup*/
	return (

        /* flex maybe */
	<div className="relative width height high-temprature rounded y-0 opacity-1"
    id='MainCard'
    ref={mainRef}>
        <div className='absolute inset-0 grid grid-rows-3 gap-1 md:gap-2 place-items-center'>
            <header className="font-inter font-medium tracking-wide
			text-5xl sm:text-4xl md:text-6xl lg:text-[4.2rem] opacity-1 y-0
			text-indigo-50 drop-shadow self-end"
        id='arise'>38°C</header>
		<p className="font-poppins font-extralight 
			text-4xl sm:text-3xl md:text-5xl lg:text-[3.3rem]
			tracking-widest text-shadow-2xl opacity-1 y-0"
            id='feels'>Feels Like <span className='tracking-wide'>35°</span></p>
		<p className="font-poppins font-light
			text-[1.2rem] sm:text-[1rem] md:text-[1.6rem] lg:text-[1.75rem] self-start
			tracking-widest pt-1 x-0"
            id='lowhigh'>Lowest 31° | Highest 40°</p>
		</div> 
      </div>
		);
}

function StatusCard() {
    // const animateRef = useRef(initialValue);
    // gsap.registerPlugin(SplitType)


    useGSAP(() => {
         gsap.from('#StatusCard', {
            opacity: 0,
            y: -30,
            ease: 'bounce.out',
            duration: 1,
            absolute: true,
            delay: 2.5
        });

        gsap.from('#sun', {
            opacity: 0,
            rotation: 360,
            ease: 'sine.inOut',
            duration: 8,
            repeat: -1,
            yoyo: true,
            delay: 5.5
        })

        const toSplit = new SplitType('#split', {
            types: 'words, chars',
        });

        gsap.from(toSplit.words, {
            delay: 4.5,
            y: -30,
            opacity: 0,
            duration: 2.2,
            stagger: 0.65,
            ease: 'back.inOut',
        })

        gsap.from('#MiniContainer', {
            opacity: 0,
            ease: 'back.in',
            delay: 7
        })

        /* Flip plugin does the math for you, you record the first and last position
        or shape
         */ 

    }, [])



	return (
        <div className='relative width height bg-clear-sky rounded
    en shadow'
      id='StatusCard'>
		<div className="absolute inset-0 grid grid-rows-2 gap-2 md:gap-4 lg:gap-8 place-items-center">
		 <h1 className="font-poppins font-medium tracking-wide
		 	text-4xl sm:text-3xl md:text-5xl lg:text-[3.2rem]
		 	text-gray-100 drop-shadow opacity-1 y-0
		 	 row-start-1 justify-self-start self-start pl-4
		 	 " id='split'>Clear Sky</h1>
		 <img src={sunIcon} alt="sun icon"
		 	className="row-start-1 justify-self-center self-start mt-3 sm:mt-4 size-16 sm:size-12 md:size-[5.6rem] 
            lg:size-24 ml-20 sm:ml-8" 
          id='sun'></img>
          <div id='MiniContainer' className='w-auto h-fit max-h-[4.9rem] sm:max-h-[3.4rem] md:max-h-[6.3rem] lg:max-h-[6.3rem] py-2
           bg-gray-50/50 col-span-2 opacity-1
           justify-self-center self-start shadow rounded-xl px-8 sm:px-6 md:px-12 lg:px-14
           md:rounded-2xl
           grid-rows-3 grid-cols-2 place-items-center  gap-y-4 sm:gap-y-3 md:gap-y-4 lg:gap-y-3 
           gap-x-20 sm:gap-x-12 md:gap-x-28 lg:gap-x-32 grid'>        
              <p className='font-inter font-bold text-size 
              tracking-wide'>15 KM/h SE </p>
              <img src={windIcon} alt='wind icon' className='size-6 sm:size-4 md:size-7'/>
            <p className='font-inter font-extralight
            text-size tracking-wide row-start-3'>Wind</p>
              <p className='font-inter font-bold text-size col-start-2
               row-start-1'>38%</p>
              <img src={humidityIcon} alt='humidity icon'
              className='size-6 sm:size-4 md:size-7'/>
              <p className='font-inter text-size col-start-2 row-start-3
              tracking-wide'>Humidity</p> 
          </div>
		</div>
        </div>
		); 
}

function TimeCard() {
    const [ appear, setAppear ] = useState(false);

        useGSAP(() => {
            let timer;
            timer = setTimeout(() => {
                setAppear(true);
            }, 12500)

            gsap.from('#TempCard', {
            opacity: 0,
            y: -20,
            ease: 'bounce.out',
            duration: 1.5,
            absolute: true,
            delay: 8
        });
            gsap.from('#City', {
                opacity: 0,
                y: -25,
                ease: 'back.inOut',
                duration: 2,
                delay: 9.2
        })
        
            gsap.from('#timeNday', {
                opacity: 0,
                x: -25,
                ease: 'sine.out',
                duration: 2,
                delay: 11
            })

            const Tip = new SplitType('#tip', {types: 'words, chars'})
            gsap.from(Tip.chars, {
                opacity: 0,
                y: 15,
                ease: 'back.out',
                duration: 1,
                stagger: 0.5,
                delay: 13
            })
            const content = new SplitType('#content', {types: 'words'})
            gsap.from(content.words, {
                opacity: 0,
                x: -5,
                ease: 'back.out',
                duration: 1.5,
                stagger: 1,
                delay: 16
            }) 
            return () => clearTimeout(timer);
        }, []) 
	 return (
         <div id='TempCard' className='relative width height bg-morning-day rounded
        en'>
	 	<div className="absolute inset-0 grid grid-rows-3 gap-0 sm:gap-6 md:gap-0
       place-items-center">
        <h1 className='font-inter font-semibold text-3xl sm:text-2xl md:text-5xl
        text-gray-100 row-start-1 justify-self-start
         pl-6 pt-3 tracking-wide drop-shadow y-0 opacity-1'
         id='City'>Singapore</h1>
        <p id='timeNday' className='font-inter text-size text-shadow row-start-2 pb-3 opacity-1 x-0 y-0
        justify-self-start pl-10 tracking-widest whitespace-pre leading-9 sm:leading-6 md:leading-10'>
        <span className='tracking-wide'>Sat/Oct 18</span> <br/>
        11:10  PM</p>
        <p className='font-poppins font-light text-size text-shadow justify-self-start
        row-start-3 pl-8 pb-6 tracking-wide opacity-1 x-0 y-0
        '>
        <span className='font-semibold opacity-1 x-0 y-0' id='tip'>Tip</span> <span id='content' className='opacity-1 x-0 y-0'> carry sunscreen!</span></p>        
        <img src={skyScrapper} alt='skyScrapper icon'
        className={`row-start-3 justify-self-end size-36 sm:size-32 md:size-40 lg:size-44 transition-all duraiton-300 ease-in ${appear ? 'opacity-1' : 'opacity-0'}
        pb-6`}/>
        </div>
         </div>
         /* solved the issue; Outer container handles styling and look */
        /* inner grid/flex container handles layout and structure */

    );
}

// resultPage canvas and cards aren't yet fully responsive...
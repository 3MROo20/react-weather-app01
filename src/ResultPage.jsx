import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sunIcon from './resultPageAssests/icons/sun.svg';
import windIcon from './resultPageAssests/icons/Wind.svg';
import humidityIcon from './resultPageAssests/icons/humidity_percentage.svg';
import skyScrapper from './resultPageAssests/icons/skyscraper.svg';
import './index.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitType from 'split-type';



export default function ResultPage() {
	const [ nav, setNav ] = useState(false);
	const navigate = useNavigate();
	
	if(nav) {
	 navigate('/');
	}

	return (
		// Rule for scroll is that the browser adds it by default but only when
		// the content exceeds the height/width of the container
		// and the container allows overflow
     <div className='bg-gray-500/20 not-italic
     	w-full min-w-[600px]
        h-auto rounded-md sm:rounded-lg md:xl lg:rounded-2xl
        p-6 sm:p-4 md:p-8 lg:p-10o'>
     <div className="flex flex-col gap-4 justify-center items-center">
       <button className='w-12 h-6 self-end' onClick={() => 
		setNav(!nav)}>back</button> 
	<TempCard />
	<StatusCard />
	<TimeCard />
	</div>
     </div>

		
		);
}

function TempCard() {
    useGSAP(() => {

        const rise = new SplitType('#arise', {
            types: 'words, chars, lines',
        });

        gsap.from(rise.chars, {
            y: -100,
            opacity: 0,
            duration: 2,
            ease: 'power3.inOut',
            stagger: 0.3,
        })

    }, [])
	return (

	<div className="relative overflow-hidden width height high-temprature rounded">
        <div className='absolute inset-0 grid grid-rows-3 gap-0 place-items-center'>
		<header className="font-inter font-medium tracking-widest
			text-4xl sm:text-3xl md:text-6xl opacity-1 y-0
			text-indigo-50 pb-0.5 drop-shadow self-end"
        id='arise'>38°C</header>
		<p className="font-poppins font-extralight 
			text-3xl sm:text-2xl md:text-5xl 
			tracking-wide text-shadow-2xl">Feels Like 35°</p>
		<p className="font-poppins font-light
			text-xl sm:text-lg md:text-2xl self-start
			tracking-wide pt-2.5">Lowest 31° | Highest 40°</p>
		</div>
      </div>
		);
}

function StatusCard() {
    // const animateRef = useRef(initialValue);
    // gsap.registerPlugin(SplitType)


    useGSAP(() => {
        gsap.to('#sun', {
            rotation: 360,
            ease: 'ease.inOut',
            duration: 10,
            repeat: -1,
            yoyo: true,
        })

        const toSplit = new SplitType('#split', {
            types: 'words, chars',
        });

        gsap.from(toSplit.words, {
            y: -150,
            opacity: 0,
            duration: 2.5,
            stagger: 0.5,
            ease: 'back.inOut',
            repeat: 2,
            yoyo: true,
        })
    }, [])




	return (
        <div className='relative width height bg-clear-sky rounded
        overflow-hidden shadow'>
		<div className="absolute inset-0 grid grid-rows-2 gap-6 place-items-center">
		 <h1 className="font-poppins font-medium tracking-wide
		 	text-3xl sm:text-2xl md:text-5xl
		 	text-gray-100 drop-shadow opacity-1 y-0
		 	 row-start-1 justify-self-start pl-6
		 	 " id='split'>Clear Sky</h1>
		 <img src={sunIcon} alt="sun icon"
		 	className="row-start-1 justify-self-center size-24"
          id='sun'></img>
          <div className='w-full max-w-[30rem] sm:max-w-[28] md:max-w[32rem]
           lg:max-w-[34] h-full max-h-24 sm:max-h-20 md:max-h-28
           bg-gray-50/50 col-span-2 p-2 sm:p-2 md:p-4 lg:p-6
           justify-self-center self-start shadow rounded-xl sm:rounded-lg
           md:rounded-2xl
           grid grid-rows-3 grid-cols-2 gap-8 place-items-center'>
              <p className='font-inter font-bold text-size
              tracking-wide'>15 KM/h SE </p>
              <img src={windIcon} alt='wind icon' className='size-6'/>
            <p className='font-inter font-extralight
            text-size tracking-wide row-start-3'>Wind</p>
              <p className='font-inter font-bold text-size col-start-2
               row-start-1'>38%</p>
              <img src={humidityIcon} alt='humidity icon'
              className='size-6'/>
              <p className='font-inter text-size col-start-2 row-start-3
              tracking-wide'>Humidity</p>
          </div>
		</div>
        </div>
		);
}

function TimeCard() {
	 return (
         <div className='relative width height bg-morning-day rounded
            overflow-hidden'>
	 	<div className="absolute inset-0 grid grid-rows-3 gap-0
       place-items-center">
        <h1 className='font-inter font-semibold text-[2.5rem]
        text-gray-100 row-start-1 justify-self-start
         pl-6 pt-6 tracking-wide drop-shadow'>Singapore</h1>
        <p className='font-inter text-size text-shadow row-start-2
        justify-self-start pl-10 tracking-widest whitespace-pre'>
        <span className='tracking-wide'>Sat/Oct 18</span> <br/>
        11:10  PM</p>
        <p className='font-poppins font-light text-size text-shadow justify-self-start
        row-start-3 pl-8 pb-6 tracking-wide'>
        <span className='font-semibold'>Tip</span>: carry sunscreen!</p>
        <img src={skyScrapper} alt='skyScrapper icon'
        className='row-start-3 justify-self-end size-36 pb-6'/>
        </div>
         </div>
         /* solved the issue; Outer container handles styling and look */
        /* inner grid/flex container handles layout and structure */

    );
}


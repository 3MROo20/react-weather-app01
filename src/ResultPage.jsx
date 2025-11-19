import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sunIcon from './resultPageAssests/icons/theSun.svg';
import windIcon from './resultPageAssests/icons/Wind.svg';
import humidityIcon from './resultPageAssests/icons/humidity_percentage.svg';
import skyScrapper from './resultPageAssests/icons/skyscraper.svg';
import clearSkyIcon from './resultPageAssests/icons/theSun.svg';
import cloudyIcon from './resultPageAssests/icons/clouds only.svg';
import rainyIcon from './resultPageAssests/icons/raining clouds.svg';
import snowyIcon from './resultPageAssests/icons/snowy clouds.svg';
import './index.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import SplitType from 'split-type';
    gsap.registerPlugin(Flip, useGSAP);
import { useWeatherStore } from './SearchPage';
import { create } from 'zustand';


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
     	 -z-10 bg-center bg-no-repeat bg-cover blur-[2px] inset-0 min-h-screen overflow-hidden'>
        </div>
    </div>
     <div className='not-italic bg-gray-50/30 w-11/12 sm:w-3/4 md:w-2/3 m-auto max-w-[35rem]
         h-fit rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl -z-10
         p-6 sm:p-4 md:p-8 lg:p-10 xl:p-12 overflow-hidden shadow-lg shadow-gray-900/50'>
     <div className="flex flex-col flex-wrap gap-4 justify-center items-center">
       <button className='w-12 h-8 self-end bg-gray-50/50 rounded px-2 py-1 text-sm hover:bg-gray-50/70 transition-colors' onClick={() =>
		setNav(!nav)}>back</button>
	<TempCard />
	<StatusCard />
	<TimeCard />
	</div>
     </div>
    </>

		
		);
}

export const useLayoutStore = create((set) => ({
    variant: '',
    setVariant: (variant) => set({ variant }),
}));

function TempCard() {
    const layoutVariant = useWeatherStore((s) => s.layoutVariant);
    const weather = useWeatherStore((s) => s.weather);
    const { variant, setVariant } = useLayoutStore();

    if (!weather) return <p className='center text-3xl'>No data available 😿</p>;


    useEffect(() => {

        const currentVariant = layoutVariant();
        setVariant(currentVariant);

        // changed from gsap.from to gsap.set and gsap.to to ensure that temp card animates properly on re-render
        gsap.set('#MainCard', { y: -80, opacity: 0 });
        gsap.to('#MainCard', {
            y: 0,
            opacity: 1,
            ease: 'bounce.out',
            duration: 1,
            delay: 0.35
        });

        gsap.set('#arise', { y: -15, opacity: 0 });
        gsap.to('#arise', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.in',
            delay: 1.2
        });

        {/* Feels like part */}
        gsap.set('#feels', { opacity: 0, y: 20 });
        gsap.to('#feels', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            delay: 3.5,
        });

        {/*Lowest Highest part*/}
        const lowhigh = new SplitType('#lowhigh', {type: 'words'})
        gsap.set(lowhigh.words, { opacity: 0, x: -20 });
        gsap.to(lowhigh.words, {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: 'sine.out',
            delay: 5,
        });

    }, [weather, layoutVariant, setVariant]) /*for cleanup*/
// olor based on background
    const textColor = (variant === 'hot' || variant === 'mild') ? 'text-gray-900' : 'text-white';

	return (

	<div className={`relative width height ${variant === 'hot' ? 'bg-high-temp' : variant === 'mild' ? 'bg-mild-temp': variant === 'cold' ? 'bg-cold-temp' : variant === 'freezing' ? 'bg-freezing-temp' : 'bg-high-temp'} 
    shadow-lg shadow-gray-900/50 rounded opacity-100`} 
    id='MainCard'>
        <div className='absolute inset-0 grid grid-rows-3 gap-1 md:gap-2 place-items-center'>
            <header className={`font-inter font-medium tracking-wide
			text-5xl sm:text-4xl md:text-6xl lg:text-[4.2rem] opacity-100 y-0
			drop-shadow self-end ${textColor}`}
        id='arise'>{Math.floor(weather?.current?.temp_c)}°C</header>
		<p className='font-poppins font-extralight
			text-4xl sm:text-3xl md:text-5xl lg:text-[3.3rem]
			tracking-widest text-shadow-2xl opacity-100 y-0'
            id='feels'>Feels Like <span className='tracking-wide'>{Math.floor(weather?.current?.feelslike_c)}°</span></p>
		<p className='font-poppins font-light
			text-[1.2rem] sm:text-[1rem] md:text-[1.6rem] lg:text-[1.75rem] self-start
			tracking-widest pt-1 x-0'
            id='lowhigh'>Lowest {Math.floor(weather?.current?.temp_c - 5)}° | Highest {Math.floor(weather?.current?.temp_c + 5)}°</p>
		</div>
    {/* // Conditional text c */}
      </div>
		);
}

function StatusCard() {
    const weather = useWeatherStore((s) => s.weather);
    const { variant } = useLayoutStore();
    const layoutVariant = useWeatherStore((s) => s.layoutVariant);
    const { setVariant } = useLayoutStore();

    if (!weather) return <p className='center text-3xl'>No data available 😿</p>;

    // Conditional icon based on weather variant
    const getWeatherIcon = () => {
        switch (variant) {
            case 'Clear Sky':
                return clearSkyIcon;
            case 'Rainy':
                return rainyIcon;
            case 'Cloudy':
                return cloudyIcon;
            case 'Snowy':
                return snowyIcon;
            default:
                return sunIcon;
        }
    };

    useEffect(() => {
        const currentVariant = layoutVariant();
        setVariant(currentVariant);

         gsap.set('#StatusCard', { opacity: 0, y: -30 });
         gsap.to('#StatusCard', {
            opacity: 1,
            y: 0,
            ease: 'bounce.out',
            duration: 1,
            delay: 2.5
        });

        // gsap.set('#weatherIcon', { opacity: 0, rotation: 0 });
        // gsap.to('#weatherIcon', {
        //     opacity: 1,
        //     rotation: 360,
        //     ease: 'sine.inOut',
        //     duration: 8,
        //     repeat: -1,
        //     yoyo: true,
        //     delay: 5.5
        // })

        const toSplit = new SplitType('#split', {
            types: 'words, chars',
        });

        gsap.set(toSplit.words, { y: -30, opacity: 0 });
        gsap.to(toSplit.words, {
            y: 0,
            opacity: 1,
            duration: 2.2,
            stagger: 0.65,
            ease: 'back.inOut',
            delay: 5,
        })

        gsap.set('#MiniContainer', { opacity: 0 });
        gsap.to('#MiniContainer', {
            opacity: 1,
            ease: 'back.in',
            delay: 7
        })


    }, [weather, layoutVariant, setVariant])



	return (
        <div className={`relative width height ${variant === 'Rainy' ? 'bg-rainy-bg' : variant === 'Cloudy' ? 'bg-cloudy-bg' : variant === 'Clear Sky' ? 'bg-clear-sky' : variant === 'Snowy' ? 'bg-snowy-bg' : 'bg-morning-day'}
        rounded shadow-lg shadow-gray-900/50`}
      id='StatusCard'>
		<div className="absolute inset-0 grid grid-rows-2 gap-2 md:gap-4 lg:gap-8 place-items-center">
		 <h1 className="font-poppins font-medium tracking-wide
		 	text-3xl sm:text-2xl md:text-5xl leading-8
		 	text-gray-100 drop-shadow opacity-100 y-0 z-50
		 	 row-start-1 justify-self-start self-start ml-4 sm:ml-2 md:ml-6 lg:ml-6
		 	 break-words" id='split'>{weather?.current?.condition?.text}</h1>
		 <img src={getWeatherIcon()} alt="weather icon"
		 	className={`row-start-1 justify-self-center self-start mt-3 sm:mt-4 size-16 sm:size-12 md:size-[6rem]
            lg:size-24 ml-20 sm:ml-8 md:ml-16 lg:ml-20
            drop-shadow`}
          id='weatherIcon'></img>        {/* min-w-[4rem] sm:min-w-[3] md:min-w-[5.2] lg:min-w-[6rem] */}
          <div id='MiniContainer' className='w-auto h-fit max-h-[5.2rem] sm:max-h-[4rem] md:max-h-[6.3rem] lg:max-h-[6.7rem] py-2
           bg-gray-50/50 col-span-2 opacity-100
           justify-self-center self-start shadow rounded-xl px-4 sm:px-3 md:px-6 lg:px-8
           md:rounded-2xl
           grid-rows-3 grid-cols-2 place-items-center  gap-y-4 sm:gap-y-3 md:gap-y-4 lg:gap-y-3
           gap-x-12 sm:gap-x-6 md:gap-x-20 lg:gap-x-24 grid'>
              <p className='font-inter font-bold text-size
              tracking-wide'>{Math.floor(weather?.current?.wind_kph)} KM/h {weather?.current?.wind_dir}</p>
              <img src={windIcon} alt='wind icon' className='size-6 sm:size-4 md:size-7'/>
            <p className='font-inter font-extralight
            text-size tracking-wide row-start-3'>Wind</p>
              <p className='font-inter font-bold text-size col-start-2
               row-start-1'>{weather?.current?.humidity}%</p>
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
    const weather = useWeatherStore((s) => s.weather);
    const layoutVariant = useWeatherStore((s) => s.layoutVariant);
    const { variant, setVariant } = useLayoutStore();

    if (!weather) return <p className='center text-3xl'>No data available 😿</p>;

        useGSAP(() => {
            let timer;
            timer = setTimeout(() => {
                setAppear(true);
            }, 12500)

            gsap.set('#TempCard', { opacity: 0, y: -20 });
            gsap.to('#TempCard', {
                opacity: 1,
                y: 0,
                ease: 'bounce.out',
                duration: 1.5,
                delay: 8
            });
            gsap.set('#City', { opacity: 0, y: -25 });
            gsap.to('#City', {
                opacity: 1,
                y: 0,
                ease: 'back.inOut',
                duration: 2,
                delay: 9.2
            });

            gsap.set('#timeNday', { opacity: 0, x: -25 });
            gsap.to('#timeNday', {
                opacity: 1,
                x: 0,
                ease: 'sine.out',
                duration: 2,
                delay: 11
            });

            const Tip = new SplitType('#tip', {types: 'words, chars'})
            gsap.set(Tip.chars, { opacity: 0, y: 15 });
            gsap.to(Tip.chars, {
                opacity: 1,
                y: 0,
                ease: 'back.out',
                duration: 1,
                stagger: 0.5,
                delay: 14
            });
            const content = new SplitType('#content', {types: 'words'})
            gsap.set(content.words, { opacity: 0, x: -5 });
            gsap.to(content.words, {
                opacity: 1,
                x: 0,
                ease: 'back.out',
                duration: 1.5,
                stagger: 1,
                delay: 16.5
            });
            return () => clearTimeout(timer);
        }, [])
	 return (
         <div id='TempCard' className='relative width height bg-morning-day rounded shadow-lg shadow-gray-900/50'>
	 	<div className="absolute inset-0 grid grid-rows-3 gap-0 sm:gap-6 md:gap-0
       place-items-center">
        <h1 className='font-inter font-semibold text-2xl sm:text-xl md:text-4xl lg:text-5xl
        text-gray-100 row-start-1 justify-self-start
         pl-6 pt-3 tracking-wide drop-shadow y-0 opacity-100 break-words'
         id='City'>{weather?.location?.name}</h1>
        <p id='timeNday' className='font-inter text-size text-shadow row-start-2 pb-3 opacity-100 x-0 y-0
        justify-self-start pl-10 tracking-widest whitespace-pre leading-9 sm:leading-6 md:leading-10 break-words'>
        <span className='tracking-wide'>{new Date(weather?.location?.localtime).toLocaleDateString()}</span> <br/>
        {new Date(weather?.location?.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className='font-poppins font-light text-size text-shadow justify-self-start
        row-start-3 pl-8 pb-6 tracking-wide opacity-100 x-0 y-0 break-words'>
        <span className='font-semibold opacity-100 x-0 y-0' id='tip'>Tip</span> <span id='content' className='opacity-100 x-0 y-0'> {variant === 'hot' ? 'carry sunscreen!' : variant === 'cold' ? 'wear warm clothes!' : variant === 'freezing' ? 'stay indoors!' : variant === 'Rainy' ? 'take an umbrella!' : variant === 'Cloudy' ? 'it might rain!' : variant === 'Snowy' ? 'drive carefully!' : variant === 'Clear Sky' ? 'perfect day!' : variant === 'mild' ? 'nice weather!' : 'enjoy the weather!'}</span></p>
        <img src={skyScrapper} alt='skyScrapper icon'
        className={`row-start-3 justify-self-end size-36 sm:size-32 md:size-40 lg:size-44 transition-all duration-300 ease-in ${appear ? 'opacity-100' : 'opacity-0'}
        pb-6`}/>
        </div>
         </div>


    );
}

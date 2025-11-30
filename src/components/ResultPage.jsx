import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sunIcon from '/assets/icons/theSun.svg';
import windIcon from '/assets/icons/Wind.svg';
import humidityIcon from '/assets/icons/humidity_percentage.svg';
import skyScrapper from '/assets/icons/skyscraper.svg';
import clearSkyIcon from '/assets/icons/theSun.svg';
import cloudyIcon from '/assets/icons/cloudsNsun.svg';
import foggyIcon from '/assets/icons/FoggyDay.svg';
import rainyIcon from '/assets/icons/raining clouds.svg';
import snowyIcon from '/assets/icons/snowy clouds.svg';
import './index.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import SplitType from 'split-type';
    gsap.registerPlugin(Flip, useGSAP);
import { useWeatherStore } from './stores';
import { create } from 'zustand';
import { useAppStore } from './stores';


export default function ResultPage() {
	const [ nav, setNav ] = useState(false);
	const navigate = useNavigate();
	const setHasVisitedSearchPage = useAppStore((s) => s.setHasVisitedSearchPage);

	if(nav) {
	 navigate('/');
	}

    function handleClick () {
        setNav(!nav);
        setHasVisitedSearchPage(true);
    }

    
	return (
    <> 
    <div className='relative'>
        <div className='absolute bg-[url(/assets/images/MagicalCastle.jpg)]
     	 -z-10 bg-center bg-no-repeat bg-cover blur-[0.5px] md:blur-[0.8px] inset-0 h-screen md:min-h-screen py-4 md:py-20 lg:py-28 overflow-hidden'>
        </div>
    </div>
     <div id='glassCover' className='not-italic glass-border bg-gray-50/10 md:bg-gray-50/20 w-[98%] md:w-2/3 m-auto max-w-[35rem]
         min-h-screen rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl -z-10 
         py-4 md:py-4 lg:py-2 px-0 sm:px-0 md:px-8 lg:px-10 xl:px-12 overflow-hidden containerShadow
         flex justify-center items-center'>
     <div className="flex flex-col gap-4 justify-center items-center">
       <button className='w-12 h-8 self-end bg-gray-50/50 rounded px-2 py-1 text-sm hover:bg-gray-50/70 transition-colors' 
       onClick={handleClick}>back</button>
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


const countWords = (text = '') =>
    text
        ?.trim()
        .split(/\s+/)
        .filter(Boolean).length || 0;

const chunkConditionText = (text = '') => {
    const words = text?.trim().split(/\s+/).filter(Boolean) || [];
    if (!words.length) return [];

    if (words.length <= 2) return [words.join(' ')];

    const paired = [];
    for (let i = 0; i < words.length; i += 2) {
        if (words[i + 1]) {
            paired.push(`${words[i]} ${words[i + 1]}`);
        } else {
            paired.push(words[i]);
        }
    }

    return paired;
};

function TempCard() {
    const weather = useWeatherStore((s) => s.weather);
    const tempVariant = useWeatherStore((s) => s.tempVariant);
    const variantLocal = tempVariant();

    if (!weather) return <p className='center text-3xl'>No data available 😿</p>;


    useEffect(() => {

        {/* Temperature card animation */}
        gsap.set('#MainCard', { y: -80, opacity: 0 });
        gsap.to('#MainCard', {
            y: 0,
            opacity: 1,
            ease: 'bounce.out',
            duration: 1.2,
            delay: 0.35
        });

        {/* Temperature part */}
        gsap.set('#arise', { y: -25, opacity: 0 });
        gsap.to('#arise', {
            y: 0,
            opacity: 1,
            duration: 2.4,
            ease: 'expo.out',
            delay: 1.4
        });

        {/* Feels like part */}
        gsap.set('#feels', { opacity: 0, y: 20 });
        gsap.to('#feels', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.inOut',
            delay: 2.8,
        });

        {/*Lowest Highest part*/}
        const lowhigh = new SplitType('#lowhigh', {type: 'words'})
        gsap.set(lowhigh.words, { opacity: 0, x: -20 });
        gsap.to(lowhigh.words, {
            opacity: 1,
            x: 0,
            duration: 1.7,
            ease: 'sine.out',
            delay: 4.2,
        });
        
    }, [weather, tempVariant]) 

    
	return (

    <div className={`relative width height ${variantLocal === 'hot' ? 'high-temp' : variantLocal === 'mild' ? 'mild-temp': variantLocal === 'cold' ? 'cold-temp' : variantLocal === 'freezing' ? 'freezing-temp' : 'mild-temp'} 
    containerShadow rounded opacity-100 overflow-hidden`} 
    id='MainCard'>
        <div className='absolute inset-0 grid grid-rows-3 place-items-center overflow-hidden'>
            <header className={`font-inter font-medium tracking-wide
			text-5xl sm:text-4xl md:text-6xl lg:text-[4.2rem] opacity-100 y-0
			drop-shadow self-end text-white`}
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
    const weatherVariant = useWeatherStore((s) => s.weatherVariant);
    const variantLocal = weatherVariant();
    const [ showIcon, setShowIcon ] = useState(false);
    const conditionTextRaw = weather?.current?.condition?.text ?? '';
    const conditionWordCount = countWords(conditionTextRaw);
    const conditionChunks = chunkConditionText(conditionTextRaw);
    const conditionSizeClass = conditionWordCount > 2
        ? 'text-[1.2rem] sm:text-xl md:text-[2rem] lg:text-[2rem] leading-wide'
        : conditionWordCount  === 1 ? 'text-4xl sm:text-2xl md:text-4xl lg:text-[2.5rem] whitespace-pre' : 'text-3xl sm:text-2xl md:text-4xl lg:text-[2.5rem] leading-wide'; 
        const PushCloud = variantLocal === 'Cloudy' && conditionWordCount === 1;
        
    if (!weather) return <p className='center text-3xl'>No data available 😿</p>;

    // Conditional icon based on weather variant
    const getWeatherIcon = () => {
        switch (variantLocal) {
            case 'Clear Sky':
                return clearSkyIcon;
            case 'Rainy':
                return rainyIcon;
            case 'Cloudy':
                return cloudyIcon;
            case 'Foggy':
                return foggyIcon;
            case 'Snowy':
                return snowyIcon;
            default:
                return sunIcon;
        }
    };


    useEffect(() => {
        let iconTimer;

        // Status card animation
        gsap.set('#StatusCard', { opacity: 0, y: -20 });
        gsap.to('#StatusCard', {
            opacity: 1,
            y: 0,
            ease: 'bounce.out',
            duration: 1.2,
            delay: 2.5
        });

        const toSplit = new SplitType('#split', {
            types: 'words, chars',
        });

        // Weather condition text animation
        gsap.set(toSplit.words, { y: -12, opacity: 0 });
        gsap.to(toSplit.words, {
            y: 0,
            opacity: 1,
            duration: 3,
            stagger: 1,
            ease: 'expo.out',
            delay: 4.5
        });

        iconTimer = setTimeout(() => {
            setShowIcon(true);
        }, 5000);

        // Weather icon animation for Clear Sky variant
        if (variantLocal === 'Clear Sky') {
            gsap.set('#weatherIcon', { rotation: 0 });
            gsap.to('#weatherIcon', {
                rotation: 360,
                ease: 'power2.inOut',
                duration: 9,
                repeat: -1,
                yoyo: true,
            });
        }

        // Mini container animation
        gsap.set('#MiniContainer', { opacity: 0 });
        gsap.to('#MiniContainer', {
            opacity: 1,
            ease: 'back.in',
            delay: 5.8
        });

        return () => clearTimeout(iconTimer);
    }, [weather, weatherVariant, variantLocal])

    const textColor = (variantLocal === 'Cloudy' || variantLocal === 'Snowy') ? 'text-[#130444]' : 'text-white';

    return (
        <div className={`relative width height ${variantLocal === 'Rainy' ? 'bg-rainy-bg' : variantLocal === 'Cloudy' ? 'bg-cloudy-bg' : variantLocal === 'Foggy' ? 'bg-foggy-bg' : variantLocal === 'Clear Sky' ? 'bg-clear-sky' : variantLocal === 'Snowy' ? 'bg-snowy-bg' : 'bg-morning-day'}
        rounded containerShadow overflow-hidden`}
      id='StatusCard'>
		<div className="absolute inset-0 grid grid-rows-2 place-items-center overflow-hidden">
         <h1 className={`${textColor} font-poppins font-medium tracking-wide
		 	${conditionSizeClass}
             drop-shadow opacity-100 y-0 z-50
		 	 row-start-1 justify-self-start self-start ml-4 sm:ml-6 md:ml-6 lg:ml-6
		 	 break-words max-w-[60%] sm:max-w-[55%] md:max-w-[50%]`} id='split'
             style={{wordBreak: 'keep-all', textWrap: conditionWordCount > 2 && 'balance'}}>
                {conditionChunks.map((chunk, index) => (
                    <span key={`${chunk}-${index}`} className={conditionWordCount > 2 && 'whitespace-nowrap'}>
                        {chunk}
                        {(conditionWordCount > 1 && index < conditionChunks.length - 1) ? ' ' : ''} 
                    </span>
                ))}
            </h1>
		 <img src={getWeatherIcon()} alt="weather icon"
		 	className={`row-start-1 ${ PushCloud ? 'justify-self-end' : 'justify-self-center'} self-start ${ variantLocal === 'Clear Sky' ? 'size-16 sm:size-12 md:size-[6rem] lg:size-24 mt-2 ml-4' :  variantLocal === 'Rainy' || variantLocal === 'Cloudy' || variantLocal === 'Snowy' || variantLocal === 'Foggy' ? 'size-28 sm:size-24 md:size-[9rem] lg:size-32 mb-4 sm:mb-4 md:mb-2 lg:mb-2 ml-1' : ''}
             'ml-20 sm:ml-8 md:ml-16 lg:ml-20 ${showIcon ? 'opacity-100' : 'opacity-0'} transition-all duration-500 ease-in-out drop-shadow`}
          id='weatherIcon'></img>      
          <div id='MiniContainer' className='w-auto h-fit max-h-[4.5rem] sm:max-h-[3rem] md:max-h-[6.3rem] lg:max-h-[6.7rem] py-2
           bg-gray-50/50 col-span-2 opacity-100
           justify-self-center self-start shadow rounded-xl px-2 sm:px-1 md:px-4 lg:px-6
           md:rounded-2xl mt-3 sm:mt-3 md:mt-1 lg:mt-5
           grid-rows-3 grid-cols-2 place-items-center  gap-y-4 sm:gap-y-3 md:gap-y-4 lg:gap-y-3
           gap-x-8 sm:gap-x-6 md:gap-x-12 lg:gap-x-20 grid'>
              <p className='font-inter font-bold text-[1.10rem] sm:text-[1rem] md:text-2xl
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
    const timeVariant = useWeatherStore((s) => s.timeVariant);
    const weatherVariant = useWeatherStore((s) => s.weatherVariant);
    const tempVariant = useWeatherStore((s) => s.tempVariant);
    const variantTimeLocal = timeVariant();
    const variantWeatherLocal = weatherVariant();
    const variantTempLocal = tempVariant();

    if (!weather) return <p className='center text-3xl'>No data available 😿</p>;

        useGSAP(() => {
            let timer;
            
            {/* Time conatiner animation */}
            gsap.set('#TempCard', { opacity: 0, y: -15 });
            gsap.to('#TempCard', {
                opacity: 1,
                y: 0,
                ease: 'bounce.out',
                duration: 1.4,
                delay: 6.5
            });

            {/* City name animation */}
            gsap.set('#City', { opacity: 0, y: -35 });
            gsap.to('#City', {
                opacity: 1,
                y: 0,
                ease: 'expo.out',
                duration: 2.2,
                delay: 8.5
            });
            
            
            {/* Time and date animation */}
            gsap.set('#timeNday', { opacity: 0, x: -25 });
            gsap.to('#timeNday', {
                opacity: 1,
                x: 0,
                ease: 'sine.out',
                duration: 2.4,
                delay: 9.5
            });

            {/* SkyScrapper icon appearance */}
            timer = setTimeout(() => {
                setAppear(true);
            }, 10000)


            {/* Tip animation */}
            const Tip = new SplitType('#tip', {types: 'words, chars'})
            gsap.set(Tip.chars, { opacity: 0, y: 15 });
            gsap.to(Tip.chars, {
                opacity: 1,
                y: 0,
                ease: 'back.out',
                duration: 1.2,
                stagger: 0.5,
                delay: 11.5
            });

            {/* Tip content animation */}
            const content = new SplitType('#content', {types: 'words'})
            gsap.set(content.words, { opacity: 0, x: -5 });
            gsap.to(content.words, {
                opacity: 1,
                x: 0,
                ease: 'back.out',
                duration: 1.7,
                stagger: 1,
                delay: 14
            });
            return () => clearTimeout(timer);
        }, [])


        const textContrast = (variantTimeLocal === 'night') ? 'text-white' : 'text-gray-900';

        // Function to get tip based on weather and temperature and status
        const getTip = () => {
            if (variantWeatherLocal === 'Rainy') return 'take an umbrella!';
            if (variantWeatherLocal === 'Snowy') return 'drive carefully!';
            if (variantTempLocal === 'hot') return 'carry sunscreen!';
            if (variantTempLocal === 'cold') return 'wear warm clothes!';
            if (variantTempLocal === 'freezing') return 'stay indoors!';
            if (variantWeatherLocal === 'Clear Sky') return 'perfect day!'; 
            if (variantWeatherLocal === 'Cloudy') return 'it might rain!';
            if (variantTempLocal === 'mild') return 'nice weather!';
            return 'enjoy the weather!';
        };

        return (
        <div id='TempCard' className={`relative width height rounded containerShadow bg-cover bg-center bg-no-repeat overflow-hidden`}
        style={{backgroundImage: variantTimeLocal === 'morning' ? 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/assets/images/Morning.jpg)' : variantTimeLocal === 'noon' ? 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/assets/images/Noon.jpg)' : variantTimeLocal === 'night' ? 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(/assets/images/Night.jpg)' : 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/assets/images/Noon.jpg)'}}
        >
	 	<div className="absolute inset-0 grid grid-rows-3 gap-0 sm:gap-6 md:gap-0 overflow-hidden
       place-items-center">
        <h1 className='font-inter font-semibold text-2xl sm:text-xl md:text-4xl lg:text-5xl
        text-gray-100 row-start-1 justify-self-start
         pl-6 pt-3 tracking-wide drop-shadow y-0 opacity-100 break-words'
         id='City'>{weather?.location?.name}</h1>
        <p id='timeNday' className={`font-inter text-size text-shadow row-start-2 pb-3 opacity-100 x-0 y-0
        justify-self-start pl-10 tracking-widest whitespace-pre leading-9 sm:leading-6 md:leading-10 break-words ${textContrast}`}>
        <span className='tracking-wide'>{new Date(weather?.location?.localtime).toLocaleDateString()}</span> <br/>
        {new Date(weather?.location?.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className={`font-poppins font-light text-size text-shadow justify-self-start
        row-start-3 pl-8 pb-6 tracking-wide opacity-100 x-0 y-0 break-words ${textContrast}`}>
        <span className='font-semibold opacity-100 x-0 y-0' id='tip'>Tip</span> <span id='content' className='opacity-100 x-0 y-0'> {getTip()}</span></p>
        <img src={skyScrapper} alt='skyScrapper icon'
        className={`row-start-3 justify-self-end size-36 sm:size-32 md:size-40 lg:size-44 transition-all duration-300 ease-in ${appear ? 'opacity-100' : 'opacity-0'}
        pb-6`}/>
        </div>
         </div>

    );
}

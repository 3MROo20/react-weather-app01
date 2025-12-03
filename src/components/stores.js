import { create } from 'zustand';

// App Store for global state management
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
	resetGlobalClick: () => set({ globalClick: false, hasTriggered: false }),

	cameraPos: [ -20, 15, 35 ],
	setCameraPos: (cameraPos) => set({ cameraPos }),

	hasPlayed: false,
	setHasPlayed: (v) => set({ hasPlayed: v}),

	hasCloudsAnimated: false,
	setHasCloudsAnimated: (v) => set({ hasCloudsAnimated: v }),

	hasCameraAnimated: false,
	setHasCameraAnimated: (v) => set({ hasCameraAnimated: v }),

	hasApplesFallen: false,
	setHasApplesFallen: (v) => set({ hasApplesFallen: v }),

	hasVisitedSearchPage: false,
	setHasVisitedSearchPage: (v) => set({ hasVisitedSearchPage: v })


}));





// Weather Store for managing API integration and weather data
export const useWeatherStore = create((set) => ({

	weather: null,  // to store the fetched data
	loading: false,		// conditioning loading phase
	error: null,			// to be assigned the error
	city: '',
	isOffline: false,  // to track if we're using offline fallback data

	setCity: (city) => set({ city }),  // shorter way

	fetchWeather: async() => {
				const { city } = useWeatherStore.getState();    // to read the city state
				if(!city) return;

				set({ loading: true, error: null}) // data is about to be fetched

				try {
				// requesting data by city - using direct WeatherAPI URL
				const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${city}&aqi=no`);

				if (!res.ok) throw new Error('city not found 😿');

				const data = await res.json();

				// Check if this is offline fallback data
				const isOffline = data.current?.condition?.text?.includes('Offline') || data.isOffline;

				set({ weather: data, loading: false, isOffline })
			} catch (err) {
				set({ error: err.message, loading: false })  // finish fetching data and assigning it weather state
			}
		},
		

		// derived state - weather condition variants
		// temprature based variant
		tempVariant: () => {
			const { weather } = useWeatherStore.getState();
			if (!weather) return 'mild';
			const temp = weather.current?.temp_c ?? 0;
			if (temp >= 30) return 'hot';
			if (temp >= 15) return 'mild';
			if (temp >= 7) return 'cold';
			if (temp < 7) return 'freezing';
			return 'mild';
		},

		// weather condition/status based variant
		weatherVariant: () => {
			const { weather } = useWeatherStore.getState();
			if (!weather) return 'Clear Sky';
			const main = weather.current?.condition?.text.toLowerCase() || '';
			if (main.includes('rain')) return 'Rainy';
			if (main.includes('cloud') || main.includes('mist')) return 'Cloudy';
			if (main.includes('fog') || main.includes('overcast')) return 'Foggy';
			if (main.includes('sunny') || main.includes('clear')) return 'Clear Sky';
			if (main.includes('snow')) return 'Snowy';
			return 'Clear Sky';
		},

		// time of day based variant
		timeVariant: () => {
			const { weather } = useWeatherStore.getState();
			if (!weather) return 'morning';
			const timeString = weather.location?.localtime || '';
			const hour = parseInt(timeString.split(' ')[1]?.split(':')[0], 10);
			if (hour >= 6 && hour < 12) return 'morning';
			if (hour >= 12 && hour < 19) return 'noon';
			if ((hour >= 19 && hour <= 23) || (hour >= 0 && hour < 6)) return 'night';
			return 'morning';
		}
}));

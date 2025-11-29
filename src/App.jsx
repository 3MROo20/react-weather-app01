import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import SearchPage from './components/SearchPage';
import ResultPage from './components/ResultPage';
import { useAppStore } from './components/stores';
import './components/index.css';

export default function App() {
	return (
	<BrowserRouter>
		<AppInner />
	</BrowserRouter>
	);
}

// Suspend the Apple falling animation if navigating ResultPage
function AppInner() {
	const setHasVisitedSearchPage = useAppStore((s) => s.setHasVisitedSearchPage);
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === '/result') {
			setHasVisitedSearchPage(true);
		}
	}, [location.pathname, setHasVisitedSearchPage]);

	return (
		<Routes>
			<Route path='/' element={<SearchPage />} />
			<Route path='/result' element={<ResultPage />}/>
		</Routes>
	);
}

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from './SearchPage';
import ResultPage from './ResultPage';
import './index.css';

export default function App() {


	return ( 
<>	
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<SearchPage />} />
			<Route path='/result' element={<ResultPage />}/>
		</Routes>
	</BrowserRouter>
</>);
}
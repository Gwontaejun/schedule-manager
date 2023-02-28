import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CalendarPage from 'page/calendar/CalendarPage';
import './App.scss';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<CalendarPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

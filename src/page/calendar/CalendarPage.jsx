import React, { useState, useEffect } from 'react';
import CalendarBody from './CalendarBody';
import moment from 'moment';
import './Calendar.scss';

const defaultSchedule = [
	{
		id: '1',
		title: '테스트 스케줄',
		content: '테스트중입니다.',
		startDate: moment().subtract('days', 1),
		endDate: moment().add('days', 1)
	}
];

const CalendarPage = () => {
	const [year, setYear] = useState();
	const [month, setMonth] = useState();
	const [schedule, setSchedule] = useState([]);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		setYear(moment().year());
		setMonth(moment().month() + 1);
		setSchedule(defaultSchedule);
	};

	const onCreateSchedule = (data) => {
		setSchedule(data);
	};

	return (
		<div className="content-wrapper">
			<CalendarBody
				year={year}
				month={month}
				schedule={schedule}
				onCreate={onCreateSchedule}
			/>
		</div>
	);
};

export default CalendarPage;

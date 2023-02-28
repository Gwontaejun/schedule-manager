import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const CalendarBody = (props) => {
	const { year, month, schedule, onCreate } = props;
	let mouseDown = undefined;
	let scheduleLength = 0;

	const onMouseOverHandle = (e) => {
		if (mouseDown) {
			const ids = [Number(e.target.getAttribute('name')), Number(mouseDown)];

			if (e.target.tagName !== 'DIV') {
				return;
			}

			document
				.querySelectorAll('.dragging')
				.forEach((element) => element.classList.remove('dragging'));
			for (let i = _.min(ids); i <= _.max(ids); i++) {
				document.getElementsByName(i)[0]?.classList.add('dragging');
			}
		}
	};

	const onMouseUpHandle = () => {
		mouseDown = undefined;

		const dateArr = [];
		document.querySelectorAll('.dragging').forEach((element, index, array) => {
			if (index === 0 || index === array.length - 1) {
				dateArr.push(element.getAttribute('data-date'));
			}
			element.classList.remove('dragging');
		});

		console.log('dateArr', dateArr);
	};

	const onScheduleDragStart = (e) => {
		const dataId = e.target.getAttribute('data-id');

		e.dataTransfer.setData('schedule-id', dataId);
		const elements = document.querySelectorAll(`div[data-id='${dataId}']`);

		scheduleLength = elements.length;

		setTimeout(() => {
			elements.forEach((item) => item.classList.add('hide'));
		}, 50);
	};

	const onScheduleDragEnter = (e) => {
		const index = Number(e.target.getAttribute('name'));

		document.querySelectorAll('.dragging').forEach((element) => {
			element.classList.remove('dragging');
		});

		for (let i = index; i < index + scheduleLength; i++) {
			document.getElementById(i)?.classList.add('dragging');
		}
	};

	const onScheduleDragDrop = (e) => {
		const scheduleId = e.dataTransfer.getData('schedule-id');
		const prevInfo = schedule.find((item) => item.id === scheduleId);
		const newInfo = {
			...prevInfo,
			startDate: moment(e.target.getAttribute('data-date')),
			endDate: moment(e.target.getAttribute('data-date')).add(
				'days',
				scheduleLength - 1
			)
		};

		const returnArr = _.cloneDeep(schedule).filter(
			(item) => item.id !== scheduleId
		);
		returnArr.push(newInfo);

		onCreate(returnArr);
		scheduleLength = 0;

		document
			.querySelectorAll('.hide, .dragging')
			.forEach((element) => element.classList.remove('hide', 'dragging'));
	};

	const generate = () => {
		const today = moment(`${year}-${month}-1`);
		const startWeek = today.clone().startOf('month').week();
		const endWeek =
			today.clone().endOf('month').week() === 1
				? 53
				: today.clone().endOf('month').week();

		const monthElement = [];

		let index = 1;
		for (let week = startWeek; week <= endWeek; week++) {
			const weekElement = Array(7)
				.fill(0)
				.map((n, i) => {
					// 오늘 => 주어진 주의 시작 => n + i일 만큼 더해서 각 주의 '일'을 표기한다.
					let current = today
						.clone()
						.week(week)
						.startOf('week')
						.add(n + i, 'day');

					const betweenData = [];

					schedule.map((item) => {
						const isBetween = current.isBetween(
							item.startDate.clone(),
							item.endDate.clone(),
							'days',
							[]
						);

						if (isBetween) {
							betweenData.push(item);
						}
					});

					return (
						<div
							key={i}
							id={index + i}
							name={index + i}
							data-date={current.format('YYYY-MM-DD')}
							className="calendar-date"
							onMouseDown={(e) => (mouseDown = e.target.id)}
							onMouseUp={onMouseUpHandle}
							onMouseOver={onMouseOverHandle}
							onDragOver={(e) => e.preventDefault()}
							onDragEnter={onScheduleDragEnter}
							onDrop={onScheduleDragDrop}
						>
							<span name={index + i} className="date-button">
								{current.dates()}
							</span>
							{_.sortBy(betweenData, 'startDate').map((item, sIndex) => (
								<div
									key={sIndex}
									className="schedule"
									data-id={item.id}
									name={index + i}
									onDragStart={onScheduleDragStart}
									draggable
								>
									{item.title}
								</div>
							))}
						</div>
					);
				});

			monthElement.push(weekElement);
			index += 7;
		}

		return monthElement.map((item, index) => {
			return (
				<div key={index} className="calendar-week">
					{item}
				</div>
			);
		});
	};

	return <div className="calendar-body">{generate()}</div>;
};

export default CalendarBody;

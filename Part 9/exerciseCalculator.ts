interface Result {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

const calculateExercises = (hours: number[], target: number) => {
	const length = hours.length;
	const trainedDays = hours.filter((num) => num > 0).length;
	const average = hours.reduce((total, value) => total + value, 0) / length;
	const success = average >= target;
	let rating;
	let ratingDescription;
	switch (true) {
		case average > target:
			rating = 3;
			ratingDescription = 'You surpassed your goal';
			break;
		case average === target:
			rating = 2;
			ratingDescription = 'You reached your goal';
			break;
		default:
			rating = 1;
			ratingDescription = 'You failed to reach your goal';
			break;
	}

	return {
		periodLength: length,
		trainingDays: trainedDays,
		success: success,
		rating: rating,
		ratingDescription: ratingDescription,
		target: target,
		average: average,
	};
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 2], 2));

interface Result {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

interface exerciseValues {
	target: number;
	hours: number[];
}

const parseArgs = (args: string[]): exerciseValues => {
	if (args.length < 4) throw new Error('Not enough arguments');

	if (
		!isNaN(Number(args[2])) &&
		args.slice(3).every((v) => !isNaN(Number(v)))
	) {
		return {
			target: Number(args[2]),
			hours: args.slice(3).map(Number),
		};
	} else {
		throw new Error('Provided values were not numbers!');
	}
};

export const calculateExercises = (hours: number[], target: number): Result => {
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

try {
	const { target, hours } = parseArgs(process.argv);
	console.log(calculateExercises(hours, target));
} catch (error: unknown) {
	let errorMessage = 'Something bad happened';
	if (error instanceof Error) {
		errorMessage += ' Error: ' + error.message;
	}
	console.log(errorMessage);
}

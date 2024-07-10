interface bmiValues {
	height: number;
	weight: number;
}

const parseArguments = (args: string[]): bmiValues => {
	if (args.length < 4) throw new Error('Not enough arguments');
	if (args.length > 4) throw new Error('Too many arguments');

	if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			height: Number(args[2]),
			weight: Number(args[3]),
		};
	} else {
		throw new Error('Provided values were not numbers!');
	}
};

const calculateBmi = (height: number, weight: number): string => {
	const bmi = weight / (height / 100) ** 2;
	let res;
	switch (true) {
		case bmi < 16.0:
			res = 'Undeweight (Severe thinness)';
			break;
		case bmi >= 16.0 && bmi < 17.0:
			res = 'Underweight (Moderate thinness)';
			break;
		case bmi >= 17.0 && bmi < 18.5:
			res = 'Underweight (Mild thinness)';
			break;
		case bmi >= 18.5 && bmi < 25.0:
			res = 'Normal range';
			break;
		case bmi >= 25.0 && bmi < 30.0:
			res = 'Overweight (Pre-obese)';
			break;
		case bmi >= 30.0 && bmi < 35.0:
			res = 'Obese (Class I)';
			break;
		case bmi >= 35.0 && bmi < 40.0:
			res = 'Obese (Class II)';
			break;
		default:
			res = 'Obese (Class III)';
			break;
	}
	return res;
};

try {
	const { height, weight } = parseArguments(process.argv);
	console.log(calculateBmi(height, weight));
} catch (error: unknown) {
	let errorMessage = 'Something bad happened';
	if (error instanceof Error) {
		errorMessage += ' Error: ' + error.message;
	}
	console.log(errorMessage);
}

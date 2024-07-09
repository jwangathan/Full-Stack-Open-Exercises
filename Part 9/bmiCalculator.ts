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

console.log(calculateBmi(140, 74));

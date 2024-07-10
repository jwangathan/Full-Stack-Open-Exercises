import express from 'express';
import calculateBmi from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack!');
});

app.get(`/bmi`, (req, res) => {
	if (!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
		const height: number = Number(req.query.height);
		const weight: number = Number(req.query.weight);
		const bmi: string = calculateBmi(height, weight);
		return res.send({
			weight: weight,
			height: height,
			bmi: bmi,
		});
	} else {
		return res.status(400).send({ error: 'malformatted parameters' });
	}
});

app.post('/exercises', (req, res) => {
	const { hours, target } = req.body;

	if (!hours || !target) {
		return res.status(400).send({ error: 'parameters missing' });
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	if (isNaN(Number(target)) || hours.map(Number).includes(NaN)) {
		return res.status(400).send({ error: 'malformatted parameters' });
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
	const result = calculateExercises(hours.map(Number), Number(target));
	return res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

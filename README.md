# AI-103 Exam Simulator

Dockerized local practice app for the AI-103 question bank.

The questions are original practice items aligned to the Microsoft Learn AI-103 study guide objectives. They are not official Microsoft, Pearson VUE, or MeasureUp exam questions.

## Run with Docker

```bash
docker build -t ai103-exam-sim .
docker run --rm -p 8088:8080 --name ai103-exam-sim ai103-exam-sim
```

Open http://localhost:8088.

## Stop

Press `Ctrl+C` in the terminal running Docker, or from another terminal:

```bash
docker stop ai103-exam-sim
```

## Features

- Full 300-question simulation
- Quick 50-question mode
- Code practice mode for snippet-based questions
- Section practice mode
- Single-choice and multiple-response questions
- Shuffled questions and shuffled answers
- Timer
- Flagged-question review
- Simulated pass/fail using a 700/1000 pass mark
- Section score breakdown and explanations

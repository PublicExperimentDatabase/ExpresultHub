# Public Experiment GUI

## Introduction

It is a dashboard that enables users to browse and manage their experiments and iteration runs.

## Get Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 18.0.0)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

#### For GUI

1. Clone the repository

```bash
git clone https://github.com/PublicExperimentDatabase/PublicExperimentGUI.git
```

2. Install dependencies

```bash
cd PublicExperimentGUI
npm install || yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

```bash
# .env.local
MONGODB_URI=<your-mongodb-uri>
```

4. Start the server

```bash
npm run dev || yarn dev
```

5. Open http://localhost:3000 in your browser

#### For CLI

1. Clone the repository

```bash
git clone https://github.com/PublicExperimentDatabase/PublicExperimentCLI.git
```

2. Install dependencies

```bash
cd PublicExperimentCLI
npm install || yarn install
```

3. Link the package

```bash
npm link || yarn link
```

## Usage

1. Write bash command

[fib_experiment](https://github.com/PublicExperimentDatabase/test-experiment.git) as an example

```bash
#!/bin/bash

# add-experiment <experiment-name> [description]
publicexperimentcli add-experiment fib
# for bucket in fib_iter fib_mem fib_rec
for bucket in fib_rec
do
    # add-bucket <bucket-name> [description]
    publicexperimentcli add-bucket fib $bucket
    for it in $(seq 0 2)
    do
        # add-iteration <experiment-name> <bucket-name> <iteration-number>
        publicexperimentcli add-iteration fib $bucket $it
        # start-monitor <experiment-name> <bucket-name> <iteration-number> <interval> [metrics ...]
        publicexperimentcli start-monitor fib $bucket $it 10
        # run
        out/$bucket 50
        # stop-monitor
        publicexperimentcli stop-monitor
    done
done

```

2. Start the experiment

```bash
sh build.sh

sh run.sh
```

3. Open http://localhost:3000 in your browser and you can see the experiment

## Project Directory Structure

```
.
├── README.md
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── public
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── (experiment)
│   │   │   └── experiments
│   │   │       ├── [experimentName]
│   │   │       │   ├── [bucketName]
│   │   │       │   │   ├── [iterationName]
│   │   │       │   │   │   └── page.tsx
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── experiments
│   │   │   │   ├── [experimentName]
│   │   │   │   │   └── buckets
│   │   │   │   │       ├── [bucketName]
│   │   │   │   │       │   └── iterations
│   │   │   │   │       │       └── route.ts
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── monitor
│   │   │       ├── start
│   │   │       │   └── route.ts
│   │   │       └── stop
│   │   │           └── route.ts
│   │   ├── favicon.ico
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── Bucket
│   │   │   ├── BucketTable.tsx
│   │   │   ├── BucketTableToolbar.tsx
│   │   │   └── NewBucketModal.tsx
│   │   ├── Experiment
│   │   │   ├── ExperimentTable.tsx
│   │   │   ├── ExperimentTableToolbar.tsx
│   │   │   └── NewExperimentModal.tsx
│   │   ├── Iteration
│   │   │   ├── IterationTable.tsx
│   │   │   ├── IterationTableToolbar.tsx
│   │   │   └── NewIterationModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── NewModal.tsx
│   │   └── TableToolbar.tsx
│   └── types
│       ├── database
│       │   ├── EnvironmentData.ts
│       │   ├── Experiment.ts
│       │   └── Iteration.ts
│       ├── global.d.ts
│       └── table.d.ts
├── tsconfig.json
├── yarn-error.log
└── yarn.lock

```

## Architecture

### API

| API                                                             | Method | Description                                                 |
| --------------------------------------------------------------- | ------ | ----------------------------------------------------------- |
| /api/experiments                                                | GET    | Get all experiments                                         |
| /api/experiments                                                | POST   | Create a new experiment                                     |
| /api/experiments                                                | DELETE | Delete selected experiments                                 |
| /api/experiments/:experimentName/buckets                        | GET    | Get buckets a specific experiment                           |
| /api/experiments/:experimentName/buckets                        | POST   | Create a new bucket                                         |
| /api/experiments/:experimentName/buckets                        | DELETE | Delete selected buckets                                     |
| /api/experiments/:experimentName/buckets/:bucketName/iterations | GET    | Get iterations of a specific bucket                         |
| /api/experiments/:experimentName/buckets/:bucketName/iterations | POST   | Create a new iteration                                      |
| /api/experiments/:experimentName/buckets/:bucketName/iterations | DELETE | Delete selected iterations                                  |
| /api/monitor/start                                              | POST   | Start monitoring and write the environment data into the db |
| /api/monitor/stop                                               | POST   | Stop monitoring                                             |

### How monitoring works

When the user types a command and sends a request to the server API `/api/monitor/start`, the server calls a child process to run `src/helper/monitor.ts`. The child process writes environment data into the database at regular intervals. When the user types a command to stop the experiment, the server calls the child process to stop.

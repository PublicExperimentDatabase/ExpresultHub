# Public Artifact and Data Visualization Repository

This repository is an integral part of the "Public Artifact and Data Visualization" project. It serves as a user-friendly Graphical User Interface (GUI) designed to visualize experiments recorded through the command-line interface. The application is built using Next.js and relies on a MongoDB cluster as its primary database. It leverages Material UI and Chart.js to implement an intuitive and visually appealing user interface. The purpose of this app is to act as a comprehensive dashboard for all user-recorded experiments, allowing for in-depth analysis of metrics.

## Table of Contents
- [Home](#home)
- [Experiment Dashboard](#experiment-dashboard)
- [Experiment Visualisation Comparison](#experiment-visualisation-comparison)
- [Experiment Details](#experiment-details)
  - [Bucket Details](#bucket-details)
  - [Iteration Details](#iteration-details)

## Home
The home page (`/home`) serves as the entry point to the website and provides navigation links to different sections of the application.

## Experiment Dashboard
The experiment dashboard (`/experiment`) is the central hub for users. It offers a comprehensive overview of all their experiments, along with links to individual experiment details.

## Experiment Visualisation Comparison
The visualisation comparison feature (`/experiments/visualisation`) is a powerful tool that enables users to compare different experiments based on various parameters. Users can visualize and compare experiment data using a variety of graphs for each recorded metric. Additionally, the app allows users to export the compared data in JSON format for reference on other devices.

## Experiment Details
The app provides a detailed structure for each experiment, with the following substructures:

### Bucket Details
`/experiment/[experiment name]` displays a list of all the buckets within the experiment. Users can also access a similar visualisation feature as the experiment dashboard.

### Iteration Details
`/experiment/[experiment name]/[bucket name]/` presents a list of all the iterations specific to a particular experiment's bucket. Like other sections, it offers visualisation features for a more granular view of the data.

### Iteration Dashboard
`/experiment/[experiment name]/[bucket name]/[Iteration name]/` offers a comprehensive dashboard for individual iterations, displaying all associated metrics and visual representations, including recorded time and intervals.

## Visualize Experiments
The `/visualise` section allows users to visualize any experiment, even those not recorded personally. Users can import JSON files containing data for a specific iteration and utilize the same powerful visualization features for comparison and analysis.

Feel free to explore, visualize, and compare your experiments efficiently with our user-friendly interface.



---



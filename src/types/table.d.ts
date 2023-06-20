interface IterationTableRow {
  id: string;
  title: string;
  user: string;
  startTime: string;
  stopTime: string;
}

interface ExperimentTableRow {
  id: string;
  title: string;
  owner: string;
  // permission: string;
  lastModified: string;
  created: string;
}

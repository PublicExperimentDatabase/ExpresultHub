interface IterationTableRow {
  id: string;
  title: string;
  user: string;
  startTime: string;
  stopTime: string;
}

interface BucketTableRow {
  id: string;
  title: string;
  lastModified: string;
  created: string;
}

interface ExperimentTableRow {
  id: string;
  title: string;
  owner: string;
  // permission: string;
  lastModified: string;
  created: string;
}

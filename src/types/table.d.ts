interface IterationTableRow {
  name: string;
  user: string;
  startTime: string;
  stopTime: string;
}

interface BucketTableRow {
  name: string;
  lastModified: string;
  created: string;
}

interface ExperimentTableRow {
  name: string;
  lastModified: string;
  created: string;
}
interface DataPoint {
  header: string;
  val: number | string;
}

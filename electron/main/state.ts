const analysisStats: any = {
  sourceStats: [],
  targetStats: [],
};
const resultStats: any = {
  freedSize: 0,
  filesCount: 0,
  dupesCount: 0,

  originalCount: 0,
  originalSize: 0,
  finalCount: 0,
  finalSize: 0,
  removedFilesCount: 0,

  copyCount: 0,
  copySize: 0,
  dedupeCount: 0,
  dedupeSize: 0,
};

const scope: any = {
  analysisStats,
  resultStats,
};

export default scope;

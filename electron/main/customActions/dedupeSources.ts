import {processOptions } from "../helpers";

export default async function dedupeSources(sources: any[], options: any) {
  const {
    hasMissingParameters,
    configurationName,
    extensions,
    isDedupe,
    isCopy,
    isAnalysis,
    isDryRun,
    errors,
  } = processOptions(sources, options);

  if (hasMissingParameters) {
    console.info("Missing parameters", {
     errors,
    });
    return false;
  }
}

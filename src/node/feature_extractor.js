import constants from "../common/constants.js";
import features from "../common/features.js";
import utils from "../common/utils.js";

import fs from "fs";

console.log("Extracting features...");

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

for (const sample of samples) {
  const paths = JSON.parse(
    fs.readFileSync(constants.JSON_DIR + "/" + sample.id + ".json")
  );
  const functions = features.inUse.map((feature) => {
    return feature.function;
  });
  sample.point = functions.map((func) => {
    return func(paths);
  });
}

// Normalize points
//const { min, max } = utils.normalizePoints(samples.map((s) => s.point));

//utils.standardizePoints(samples.slice(0, 5).map((s) => s.point));

utils.standardizePoints(samples.map((s) => s.point));

const featureNames = features.inUse.map((feature) => {
  return feature.name;
});

const featuresString = JSON.stringify({
  featureNames,
  samples: samples.map((sample) => {
    return {
      point: sample.point,
      label: sample.label,
    };
  }),
});

fs.writeFileSync(constants.FEATURES, featuresString);

fs.writeFileSync(
  constants.FEATURES_JS,
  `const features = ${JSON.stringify({
    featureNames,
    samples,
  })};export default features;
  `
);

/* fs.writeFileSync(
  constants.MIN_MAX_JS,
  `const minMax = ${JSON.stringify({
    min,
    max,
  })};export default minMax;
  `
); */

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

const featureNames = features.inUse.map((feature) => {
  return feature.name;
});
//Generating splits sets of data: training and testing
console.log("GENERATING SPLITS");
const trainingAmount = samples.length * 0.5;

const training = [];
const testing = [];

for (let i = 0; i < samples.length; i++) {
  if (i < trainingAmount) {
    training.push(samples[i]);
  } else {
    testing.push(samples[i]);
  }
}

// Normalize training
const { min, max } = utils.normalizePoints(training.map((s) => s.point));
// Normalize testing using min and max from training
utils.normalizePoints(
  testing.map((s) => s.point),
  { min, max }
);

//training
utils.writeFeaturesToFiles(
  featureNames,
  training,
  "training",
  constants.TRAINING,
  constants.TRAINING_JS
);

//testing
utils.writeFeaturesToFiles(
  featureNames,
  testing,
  "testing",
  constants.TESTING,
  constants.TESTING_JS
);

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

fs.writeFileSync(
  constants.MIN_MAX_JS,
  `const minMax = ${JSON.stringify({
    min,
    max,
  })};export default minMax;
  `
);

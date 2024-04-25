import constants from "../common/constants.js";
import features from "../common/features.js";

import fs from "fs";

console.log("Extracting features...");

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

for (const sample of samples) {
  const paths = JSON.parse(
    fs.readFileSync(constants.JSON_DIR + "/" + sample.id + ".json")
  );
  sample.point = [features.getPathCount(paths), features.getPointCount(paths)];
}

const featureNames = ["Path Count", "Point Count"];
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

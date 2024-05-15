import waait from "waait";
import fs from "fs";
import constants from "../common/constants.js";
import utils from "../common/utils.js";
import training from "../common/js_objects/training.js";
import testing from "../common/js_objects/testing.js";
import KNN from "../common/classifiers/knn.js";

console.log("Checking best k...");

function generateArray(length) {
  return Array.from({ length }, (_, i) => [i + 1, 0]);
}

let ks = generateArray(100);

/* async function calculateAccuracyForKs() {
  await Promise.all(
    ks.map(async (kItem) => {
      let knn = new KNN(training.samples, kItem[0]);
      kItem[1] = await utils.calculateAccuracy(testing.samples, null, knn);
    })
  );
}

calculateAccuracyForKs().then(() => {
  console.log(ks);
}); */

async function calculateAccuracyForKs(index) {
  if (index < ks.length) {
    // Deep copy testing.samples
    const testingCopy = JSON.parse(JSON.stringify(testing.samples));

    // Deep copy knn
    const knn = new KNN(
      JSON.parse(JSON.stringify(training.samples)),
      ks[index][0]
    );

    ks[index][1] = await utils.calculateAccuracy(testingCopy, null, knn);
    await calculateAccuracyForKs(index + 1);
  }
}

calculateAccuracyForKs(0).then(() => {
  console.log(ks);
});

/* 

const accuracy = await utils.calculateAccuracy(testing.samples, null, knn);

console.log(`Classification accuracy: ${accuracy}`); */

/* for (let i = 1; i <= ks; i++) {
  const knn = new KNN(training.samples, i);
  await waait(500);
  const accuracy = await utils.calculateAccuracy(testing.samples, null, knn);
  await waait(500);
  console.log(`Classification accuracy: ${accuracy}`);
  results.push([i, accuracy]);
} */

/* console.log(
  `Classification accuracy per k: (k, accuracy):${JSON.parse(
    JSON.stringify(results)
  )}`
); */

console.log("Done!");

import waait from "waait";
import fs from "fs";
import constants from "../common/constants.js";
import utils from "../common/utils.js";
import training from "../common/js_objects/training.js";
import testing from "../common/js_objects/testing.js";
import KNN from "../common/classifiers/knn.js";

console.log("Checking best k...");
const results = [];

function generateArray(length) {
  return Array.from({ length }, (_, i) => [i + 1, 0]);
}

let ks = generateArray(6);

for (let i = 0; i < ks.length; i++) {
  let knn = new KNN(training.samples, ks[i][0]);
  ks[i][1] = await utils.calculateAccuracy(testing.samples, null, knn);
}

console.log(ks);

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

import fs from "fs";
import constants from "../common/constants.js";
import utils from "../common/utils.js";
import training from "../common/js_objects/training.js";
import testing from "../common/js_objects/testing.js";

import KNN from "../common/classifiers/knn.js";

console.log("Running classification...");

const knn = new KNN(training.samples, 50);

const accuracy = await utils.calculateAccuracy(testing.samples, null, knn);

console.log(accuracy);

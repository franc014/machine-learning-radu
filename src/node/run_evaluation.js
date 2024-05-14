import fs from "fs";
import { createCanvas } from "canvas";
import constants from "../common/constants.js";
import utils from "../common/utils.js";
import training from "../common/js_objects/training.js";
import testing from "../common/js_objects/testing.js";

import KNN from "../common/classifiers/knn.js";

console.log("Running classification...");

const knn = new KNN(training.samples, 10);

const accuracy = await utils.calculateAccuracy(testing.samples, null, knn);

console.log("Generating decision boundary...");

const canvas = createCanvas(100, 100);
const ctx = canvas.getContext("2d");

// pixel plot: We take each individual point of the canvas and treat it as a feature
// between 0 and 1. We'll normalize it
// then we'll color each pixel according to the predicted value

for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    //create a normalized point
    // Normalize the point coordinates to be between 0 and 1
    // x is normalized to be between 0 and 1 by dividing it by the canvas width
    // y is normalized to be between 0 and 1 by dividing it by the canvas height and then subtracting the result from 1
    // This is done because the y-axis points upwards on the canvas, so we need to flip it
    const point = [x / canvas.width, 1 - y / canvas.height];
    const { label } = knn.predict(point);
    ctx.fillStyle = utils.styles[label].color;
    ctx.fillRect(x, y, 1, 1);
  }
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

console.log("DONE!");

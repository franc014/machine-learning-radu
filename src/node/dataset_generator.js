import { draw } from "../common/draw.js";
import utils from "../common/utils.js";
import { createCanvas } from "canvas";
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

import constants from "../common/constants.js";

import fs from "fs";

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;

fileNames.forEach((fileName) => {
  const filePath = constants.RAW_DIR + "/" + fileName;

  const fileContent = fs.readFileSync(filePath);

  const { session, student, drawings } = JSON.parse(fileContent);

  for (let label in drawings) {
    samples.push({
      id,
      student_id: session,
      student_name: student,
      label,
    });
    const paths = drawings[label];
    fs.writeFileSync(
      constants.JSON_DIR + "/" + id + ".json",
      JSON.stringify(paths)
    );

    generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);
    utils.printProgress(id, fileNames.length * 8);
    id++;
  }
});

function generateImageFile(outputFile, paths) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);
  /* const box = getBox(paths);
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.stroke(); */

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFile, buffer);
}

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));
fs.writeFileSync(
  constants.SAMPLES_JS,
  `const samples = ${JSON.stringify(samples)};
  export default samples;
  `
);

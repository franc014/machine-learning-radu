const utils = {};
import fs from "fs";

utils.formatPercent = (num) => `${(num * 100).toFixed(2)}%`;
utils.printProgress = (count, max) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  const percent = utils.formatPercent(count / max);
  process.stdout.write(`${count}/${max} (${percent})`);
};

utils.groupByV2 = (key, samples) => {
  return new Promise(function (resolve, reject) {
    function groupByReducer(acc, curr) {
      if (!acc[curr[key]]) {
        acc[curr[key]] = {
          student: curr.student_name,
          drawings: [
            {
              drawing: curr.label,
              img: `${curr.id}.png`,
              id: curr.id,
              correct: curr.correct,
            },
          ],
        };
      } else {
        acc[curr[key]].drawings.push({
          drawing: curr.label,
          img: `${curr.id}.png`,
          id: curr.id,
          correct: curr.correct,
        });
      }

      return acc;
    }
    try {
      const groupedBy = Object.values(samples).reduce(groupByReducer, {});
      resolve(groupedBy);
    } catch (error) {
      reject(error);
    }
  });
};

utils.byStudentV2 = (studentsData) => {
  return new Promise(function (resolve, reject) {
    try {
      let byStudent = [];

      Object.values(studentsData).forEach((student) => {
        byStudent.push(student);
      });

      resolve(byStudent);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Calculates the Euclidean distance between two points in a 2D space.
 *
 * @param {Array} p1 - The first point in the form of an array [x, y].
 * @param {Array} p2 - The second point in the form of an array [x, y].
 * @return {number} The distance between the two points.
 */
utils.distance = (p1, p2) => {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
};

/**
 * Finds the index of the nearest point in an array of points to a given location.
 *
 * @param {Array} loc - The location to find the nearest point to.
 * @param {Array} points - The array of points to search through.
 * @return {number} The index of the nearest point.
 */
utils.getNearest = (loc, points) => {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearestIndex = 0;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const d = utils.distance(loc, point);

    if (d < minDist) {
      minDist = d;
      nearestIndex = i;
    }
  }
  return nearestIndex;
};

utils.getNearestK = (loc, points, k = 1) => {
  const obj = points.map((val, ind) => {
    return { ind, val };
  });

  // We sorted so that the nearest ones will be at the top
  const sorted = obj.sort((a, b) => {
    return utils.distance(loc, a.val) - utils.distance(loc, b.val);
  });

  const indeces = sorted.map((item) => item.ind);
  return indeces.slice(0, k);
};

utils.invLerp = (a, b, v) => {
  return (v - a) / (b - a);
};

utils.normalizePoints = (points, minMax) => {
  //min and max on each of the dimensions (features); can be two or more dimensions
  let min, max;
  // in the beginning, min and max are the values of the first point
  min = [...points[0]];
  max = [...points[0]];
  const dimensions = points[0].length;

  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    // then for each point remaining
    for (let i = 1; i < points.length; i++) {
      // loop over each dimension
      for (let j = 0; j < dimensions; j++) {
        // update min and max
        min[j] = Math.min(min[j], points[i][j]);
        max[j] = Math.max(max[j], points[i][j]);
      }
    }
  }

  // transform the points
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      points[i][j] = utils.invLerp(min[j], max[j], points[i][j]);
    }
  }

  return { min, max };
};

utils.writeFeaturesToFile = (featureNames, samples, path) => {
  const featuresString = JSON.stringify({
    featureNames,
    samples: samples.map((sample) => {
      return {
        point: sample.point,
        label: sample.label,
      };
    }),
  });

  console.log(path);
  fs.writeFileSync(path, featuresString);
};

utils.writeFeaturesToFileAsJS = (featureNames, samples, varName, jsPath) => {
  fs.writeFileSync(
    jsPath,
    `const ${varName} = ${JSON.stringify({
      featureNames,
      samples,
    })};export default ${varName};
    `
  );
};

utils.calculateAccuracy = (testSamples, testingDrawings, classifier) => {
  let totalCount = 0;
  let correctCount = 0;
  return new Promise(function (resolve) {
    for (let testSample of testSamples) {
      testSample.truth = testSample.label; //we need the truth attribute when calculating accuracy
      testSample.label = "?"; // when testing we pretend the testing samples don't have labels

      const res = classifier.predict(testSample.point);

      testSample.label = res.label;
      testSample.correct = testSample.label === testSample.truth;

      if (testingDrawings) {
        utils.highlightTestingSample(testingDrawings, testSample);
      }

      correctCount += testSample.correct ? 1 : 0;
      totalCount++;
    }
    resolve(
      `ACCURACY: ${correctCount} / ${totalCount}: ${utils.formatPercent(
        correctCount / totalCount
      )}`
    );
  });
};

utils.highlightTestingSample = (testingDrawings, testSample) => {
  const { correct, id } = testSample;
  testingDrawings.forEach((drawing) => {
    const drawingId = Number(drawing.dataset.sample);

    if (drawingId === id) {
      drawing.classList.add(correct ? "correct" : "not-correct");
    }
  });
};

utils.writeFeaturesToFiles = (featureNames, samples, varName, path, jsPath) => {
  utils.writeFeaturesToFile(featureNames, samples, path);
  utils.writeFeaturesToFileAsJS(featureNames, samples, varName, jsPath);
};

utils.styles = {
  car: { color: "gray", text: "🚗" },
  fish: { color: "red", text: "🐟" },
  house: { color: "yellow", text: "🏠" },
  tree: { color: "green", text: "🌲" },
  bicycle: { color: "cyan", text: "🚲" },
  guitar: { color: "blue", text: "🎸" },
  pencil: { color: "magenta", text: "✏️" },
  clock: { color: "lightgray", text: "⏰" },
};
utils.styles["?"] = { color: "coral", text: "❓" };

export default utils;

const utils = {};
utils.formatPercent = (num) => `${(num * 100).toFixed(2)}%`;
utils.printProgress = (count, max) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  const percent = utils.formatPercent(count / max);
  process.stdout.write(`${count}/${max} (${percent})`);
};

utils.groupByV2 = (key, samples) => {
  return new Promise(function (resolve, reject) {
    function groupByReducer(acc, curr, i) {
      if (!acc[curr[key]]) {
        acc[curr[key]] = {
          student: curr.student_name,
          drawings: [
            {
              drawing: curr.label,
              img: `${i + 1}.png`,
              id: i + 1,
            },
          ],
        };
      } else {
        acc[curr[key]].drawings.push({
          drawing: curr.label,
          img: `${i + 1}.png`,
          id: i + 1,
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

utils.invLerp = (a, b, v) => {
  return (v - a) / (b - a);
};

utils.mean = (points) => {
  console.log("points", points);
  //points is an array of array of points
  //mean on each of the dimensions (features); can be two or more dimensions
  //const meanCoords = [];
  const dimensions = points[0].length;

  const meanCoords = points.reduce((acc, point) => {
    for (let i = 0; i < dimensions; i++) {
      acc[i] = (acc[i] || 0) + point[i] / points.length;
    }
    return acc;
  }, []);

  return meanCoords;
};

utils.stdDeviation = (points) => {
  //points is an array of array of points
  const mean = utils.mean(points).map((m) => Number(m.toFixed(2)));

  const deviation = points.map((point) => {
    return point.map((p, i) => {
      return (p - mean[i]) ** 2;
    });
  });

  const sum = deviation.reduce((acc, curr) => {
    for (let i = 0; i < curr.length; i++) {
      acc[i] = (acc[i] || 0) + curr[i];
    }
    return acc;
  });

  const stdDev = sum.map((s) => {
    return Math.sqrt(s / points.length);
  });

  return stdDev;
};

utils.standardizePoints = (points) => {
  console.log("points std", points);
  //points is an array of array of points
  const mean = utils.mean(points).map((m) => Number(m.toFixed(2)));

  console.log("mean", mean);
  const deviation = utils.stdDeviation(points).map((d) => Number(d.toFixed(2)));

  console.log("deviation", deviation);
  // transform the points
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      points[i][j] = (points[i][j] - mean[j]) / deviation[j] || 1;
    }
  }
};

utils.normalizePoints = (points, minMax) => {
  //points is an array of array of points
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

utils.styles = {
  car: { color: "gray", text: "🚗" },
  fish: { color: "red", text: "🐟" },
  house: { color: "yellow", text: "🏠" },
  tree: { color: "green", text: "🌲" },
  bicycle: { color: "cyan", text: "🚲" },
  guitar: { color: "blue", text: "🎸" },
  pencil: { color: "magenta", text: "✎" },
  clock: { color: "lightgray", text: "⏰" },
};

export default utils;

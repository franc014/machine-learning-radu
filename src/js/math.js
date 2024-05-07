const math = {};

math.equals = (p1, p2) => {
  return p1[0] == p2[0] && p1[1] == p2[1];
};

math.lerp = (a, b, t) => {
  return a + (b - a) * t;
};

math.invLerp = (a, b, v) => {
  return (v - a) / (b - a);
};

math.remap = (oldA, oldB, newA, newB, v) => {
  return math.lerp(newA, newB, math.invLerp(oldA, oldB, v));
};

math.remapPoint = (oldBounds, newBounds, point) => {
  return [
    math.remap(
      oldBounds.left,
      oldBounds.right,
      newBounds.left,
      newBounds.right,
      point[0]
    ),
    math.remap(
      oldBounds.top,
      oldBounds.bottom,
      newBounds.top,
      newBounds.bottom,
      point[1]
    ),
  ];
};

math.add = (p1, p2) => {
  return [p1[0] + p2[0], p1[1] + p2[1]];
};

math.subtract = (p1, p2) => {
  return [p1[0] - p2[0], p1[1] - p2[1]];
};

math.scale = (p, scaler) => {
  return [p[0] * scaler, p[1] * scaler];
};

/**
 * Calculates the Euclidean distance between two points in a 2D space.
 *
 * @param {Array} p1 - The first point in the form of an array [x, y].
 * @param {Array} p2 - The second point in the form of an array [x, y].
 * @return {number} The distance between the two points.
 */
math.distance = (p1, p2) => {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
};

math.formatNumber = (n, dec = 0) => {
  return n.toFixed(dec);
};

/**
 * Finds the index of the nearest point in an array of points to a given location.
 *
 * @param {Array} loc - The location to find the nearest point to.
 * @param {Array} points - The array of points to search through.
 * @return {number} The index of the nearest point.
 */
math.getNearest = (loc, points) => {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearestIndex = 0;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const d = math.distance(loc, point);

    if (d < minDist) {
      minDist = d;
      nearestIndex = i;
    }
  }
  return nearestIndex;
};

export default math;

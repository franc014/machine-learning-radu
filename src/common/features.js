const features = {};

features.getPathCount = (paths) => {
  return paths.length;
};

features.getPointCount = (paths) => {
  const points = paths.flat();
  return points.length;
};

features.getWidth = (paths) => {
  const points = paths.flat();
  const x = points.map((p) => p[0]);
  return Math.max(...x) - Math.min(...x);
};
features.getHeight = (paths) => {
  const points = paths.flat();
  const y = points.map((p) => p[1]);
  return Math.max(...y) - Math.min(...y);
};

features.inUse = [
  /* {
    name: "Path Count",
    function: features.getPathCount,
  },
  {
    name: "Point Count",
    function: features.getPointCount,
  }, */
  {
    name: "Width",
    function: features.getWidth,
  },
  {
    name: "Height",
    function: features.getHeight,
  },
];

export default features;

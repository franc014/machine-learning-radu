const features = {};

features.getPathCount = (paths) => {
  return paths.length;
};

features.getPointCount = (paths) => {
  const points = paths.flat();
  return points.length;
};

export default features;

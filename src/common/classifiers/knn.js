import utils from "../../common/utils.js";

class KNN {
  constructor(samples, k) {
    this.samples = samples;
    this.k = k;
  }

  predict(point) {
    const samplePoints = this.samples.map((sample) => sample.point);
    const indeces = utils.getNearestK(point, samplePoints, this.k);

    const nearestSamples = indeces.map((ind) => this.samples[ind]);
    const labels = nearestSamples.map((sample) => sample.label);

    const counts = {};

    labels.forEach((label) => {
      if (!counts[label]) {
        counts[label] = 1;
      }
      counts[label]++;
    });

    const max = Math.max(...Object.values(counts));

    const label = labels.find((label) => counts[label] === max);
    return { label, nearestSamples };
  }
}

export default KNN;

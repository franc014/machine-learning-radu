const utils = {};
utils.formatPercent = (num) => `${(num * 100).toFixed(2)}%`;
utils.printProgress = (count, max) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  const percent = utils.formatPercent(count / max);
  process.stdout.write(`${count}/${max} (${percent})`);
};

utils.groupBy = (key, samples) => {
  function groupByReducer(acc, curr, i) {
    if (!acc[curr[key]]) {
      acc[curr[key]] = {
        student: curr.student_name,
        drawings: [
          {
            drawing: curr.label,
            img: `${i + 1}.png`,
          },
        ],
      };
    } else {
      acc[curr[key]].drawings.push({
        drawing: curr.label,
        img: `${i + 1}.png`,
      });
    }

    return acc;
  }

  return samples.reduce(groupByReducer, {});
};

utils.byStudent = (studentsData) => {
  let byStudent = [];

  Object.values(studentsData).forEach((student) => {
    byStudent.push(student);
  });

  return byStudent;
};

export default utils;

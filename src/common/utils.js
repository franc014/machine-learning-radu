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

utils.styles = {
  car: { color: "gray", text: "🚗" },
  fish: { color: "red", text: "🐟" },
  house: { color: "yellow", text: "🏠" },
  tree: { color: "green", text: "🌲" },
  bicycle: { color: "cyan", text: "🚲" },
  guitar: { color: "blue", text: "🎸" },
  pencil: { color: "magenta", text: "📝" },
  clock: { color: "lightgray", text: "⏰" },
};

export default utils;

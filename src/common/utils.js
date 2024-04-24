const utils = {};
utils.formatPercent = (num) => `${(num * 100).toFixed(2)}%`;
utils.printProgress = (count, max) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  const percent = utils.formatPercent(count / max);
  process.stdout.write(`${count}/${max} (${percent})`);
};

export default utils;
